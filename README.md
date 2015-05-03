# Ephemeral P2P

This app hosts "P2P" pages that are "ephemeral". We say "P2P" because the clients host the page; new visitors retrieve the page contents from other visitors on the same page. It's "ephemeral" in that the server does not store the contents of any page, so once the last visitor leaves a particular page, it is gone.

# How it works

Ephemeral P2P is an Elixir/Phoenix app, taking advantage of Phoenix's excellent Channel functionality. All of the logic lies in two channels, the `HaveChannel` for clients who have a particular bit of content, and the `WantChannel` for visitors who want it. The content is addressed by its SHA256 (let us say `abc123`), and the two topics associated with that content are `have:abc123` and `want:abc123`.

A new page is created from the homepage. A visitor fills in the textarea with whatever content they desire, and presses the "Submit" button (which is not a form submission). The client hashes the content (let's call the hash `abc123`) and uses the HTML5 history api to change the URL to `/abc123` for easy copy/paste-ability. The client then joins the "have:abc123" topic and begins listening for `"content_request"` messages, ready to respond with a `"content"` message that includes the page content which it has in memory.

A subsequent visitor who loads `/abc123` joins the `want:abc123` topic and tries to obtain the content. First it listens for a `"content"` message that another visitor may have provoked. If the visitor does not receive it in 2 seconds, it will send a `"content_request"` message itself. The server will re-broadcast this message to all `have:abc123` subscribers, except that a `handle_out` will allow the message with probability `1/subscriber_count` and drop it otherwise. Any `have:abc123` subscribers who receive the message will respond with the content and the server will `broadcast` it to all `want:abc123` subscribers. The new visitor will send a `"content_request"` message every 2 seconds until it gets the content (for the case where the `handle_out` drops the message to everyone, or a `have` subscriber fails to respond for some reason.)

When a `want:abc123` subscriber gets the content, it leaves the `want:abc123` topic and joins the `have:abc123` topic, ready to pass it along to newer visitors.

Lastly, whenever a subscriber joins or leaves `have:abc123`, the new visitor count is broadcast, so all clients know the "health" of the page and how close it is to going away.
