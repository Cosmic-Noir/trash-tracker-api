function makeCommentsArray() {
  return [
    {
      id: 1,
      date_posted: new Date().toISOString(),
      site_id: 1,
      userRef: 1,
      content:
        "Hey I think I will swing by on saturday afternoon around 3 if anyone wants to join, I will be bringing my truck!"
    },
    {
      id: 2,
      date_posted: new Date().toISOString(),
      site_id: 1,
      userRef: 2,
      content:
        "Hey my friend and I will meet you there on Saturday and bring bags!"
    },
    {
      id: 3,
      date_posted: new Date().toISOString(),
      site_id: 1,
      userRef: 1,
      content:
        "Sounds great! My cousin is also showing up with some friends, see you then."
    },
    {
      id: 4,
      date_posted: new Date().toISOString(),
      site_id: 2,
      userRef: 1,
      content:
        "I think some friends are going to meet here Friday after school if anyone wants to help. 3PM"
    },
    {
      id: 5,
      date_posted: new Date().toISOString(),
      site_id: 5,
      userRef: 2,
      content: "Wow it looks like you guys did an awesome job!"
    }
  ];
}

function makeMaliciousComment() {
  const maliciousComment = {
    id: 911,
    date_posted: new Date().toISOString(),
    site_id: 5,
    userRef: 2,
    content: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
  const expectedComment = {
    ...maliciousNote,
    content:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return { maliciousComment, expectedComment };
}

module.exports = {
  makeCommentsArray,
  makeMaliciousComment
};
