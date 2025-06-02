import users from "./users.js"

let pendingUsers = users.filter(u=> !u.isApproved);

export default pendingUsers;