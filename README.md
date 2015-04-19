# Ephemeral P2P

This app hosts "P2P" pages that are "ephemeral". We say "P2P" because the clients host the page; new visitors retrieve the page contents from other visitors on the same page. It's "ephemeral" in that the server does not store the contents of any page, so once the last visitor leaves a particular page, it is gone.

# How it works

Ephemeral P2P is an Elixir/Phoenix app, taking advantage of Phoenix's excellent Channel functionality. All of the logic lies in two channels, the `HaveChannel` for clients who have a particular bit of content, and the `WantChannel` for visitors who want it. The content is addressed by its SHA256 (let us say `abc123`), and the two topics associated with that content are `have:abc123` and `want:abc123`.

A new page is created from the homepage. A visitor fills in the textarea with whatever content they desire, and presses the "Submit" button (which is not a form submission). The client hashes the content (let's call the hash `abc123`) and uses the HTML5 history api to change the URL to `/abc123` for easy copy/paste-ability. The client then joins the "have:abc123" topic and begins listening for `"CONTENT_REQUEST"` messages, ready to respond with a `"CONTENT"` message that includes the page content which it has in memory.

A subsequent visitor who loads `/abc123` joins the `want:abc123` topic and sends that `"CONTENT_REQUEST"` message. The `WantChannel.handle_in/3` function for this message broadcasts it on to the subscribers of `have:abc123`. Subscribers who have that content push the `"CONTENT"` message with the content itself. The `HaveChannel.handle_in/3` function verifies the hash and then broadcasts it to `want:abc123`.

When a `want:abc123` subscriber gets the content, it leaves the `want:abc123` topic and joins the `have:abc123` topic, ready to pass it along to newer visitors.

Lastly, whenever a subscriber joins or leaves `have:abc123`, the new visitor count is broadcast, so all clients know the "health" of the page and how close it is to going away.

## Performance issues/questions

### Message Storm

As naively implemented, this will generate a storm of messages. Each new visitor sends a message to ALL subscribers to the page, who ALL respond with the content, which is then broadcast to ALL new visitors. On a popular page there may be... 5,000 `have:abc123` folks, and if three new visitors appear in quick succession, I think it goes as follows:

1. visitor1 enters, sends `CONTENT_REQUEST` -> multiplexed out to 5,000 subscribers
2. visitor2 enters, sends `CONTENT_REQUEST` -> multiplexed out to 5,000 subscribers
3. visitor3 enters, sends `CONTENT_REQUEST` -> multiplexed out to 5,000 subscribers
4. 5,000 incoming `CONTENT` messages -> each multiplexed out to 3 visitors
5. 5,000 incoming `CONTENT` messages -> each multiplexed out to 3 visitors
6. 5,000 incoming `CONTENT` messages -> each multiplexed out to 3 visitors

60,000 messagse? What's the best way to fix this?

* When visitor1 enters, can send to a subset of the topic subscribers. Maybe add a `HaveChannel.handle_out` that randomly drops some proportion of messages? But what about for smaller numbers? What if visitor1 gets no response from them? Try again and hope for a better selection of subscribers next time?
* When multiple `have:abc123` subscribers respond, only broadcast the first response on to `want:abc132`? How?
* Introduce a setTimeout when a new visitor joins, before they broadcast `CONTENT_REQUEST`. Maybe `visitor2` and `visitor3` could get some responses from `visitor1`'s initial request.

### Subscriber Count

The app uses a `count` function to determine the number of subscribers for a topic which, per the Elixir documentation, implies an `O(n)` complexity (vs. a `size` function which is `O(1)`).
