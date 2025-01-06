
## DB Schema
User { id, name, email, password, ask[],reply[], room[](created & joined)}
Ask { id, question, user_id (ref), timestamp, upvote, reply[](replyRefs), roomRef }
Reply { id, repliedTo[ask | reply]ref , userRef, reply, timestamp, upvote }
Room {id,joinCode, desc,  speakerName (UserRef), Attendees[] (Psuedonym<-userRefs), Asks[] (askRefs)}

