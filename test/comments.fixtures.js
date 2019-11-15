function makeCommentsArray = () => {
    return [
        {
            id: 1,
            siteId: 1,
            userRef: "dude",
            content:
              "Hey I think I will swing by on saturday afternoon around 3 if anyone wants to join, I will be bringing my truck!"
          },
          {
            id: 2,
            siteId: 1,
            userRef: "dudette",
            content:
              "Hey my friend and I will meet you there on Saturday and bring bags!"
          },
          {
            id: 3,
            siteId: 1,
            userRef: "dude",
            content:
              "Sounds great! My cousin is also showing up with some friends, see you then."
          },
          {
            id: 4,
            siteId: 2,
            userRef: "dude",
            content:
              "I think some friends are going to meet here Friday after school if anyone wants to help. 3PM"
          },
          {
            id: 5,
            siteId: 5,
            userRef: "dudette",
            content: "Wow it looks like you guys did an awesome job!"
          }
    ]
}

module.exports = {
    makeCommentsArray
}