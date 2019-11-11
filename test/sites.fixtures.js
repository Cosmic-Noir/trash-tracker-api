function makeTrashSitesArray() {
  return [
    {
      id: 1,
      clean: "false",
      title: "Horsetooh Trail",
      addrss: "Horsetooth Resevoir",
      city: "Fort Collins",
      state_abr: "CO",
      before_img:
        "https://www.suffolknewsherald.com/wp-content/uploads/2016/05/useIMG_1460.jpg",
      after_img: "",
      content:
        "Was hiking through Horsetooth resevoir the other day when I came across someone's secret dumping site. Unbelievable! I didn't have anything on me to clean this at the time, but I thought I would post in case anyone has the time and probably a truck to haul away the refuse"
    },
    {
      id: 2,
      clean: "false",
      title: "Park Trail",
      addrss: "6th & Oak Ave",
      city: "Omaha",
      state_abr: "NE",
      before_img:
        "https://bloximages.chicago2.vip.townnews.com/wvnews.com/content/tncms/assets/v3/editorial/c/d7/cd75f812-a8e4-51ec-92dc-c6fc15d36b57/5a6ba163eeb8d.image.jpg?resize=1200%2C900",
      after_img: "",
      content:
        "Was jogging in the neighborhood the other day and saw all this trash in the woods near the park. Couldn't pick it up when I was running, but might go back this weekend and may need help."
    },
    {
      id: 3,
      clean: "false",
      title: "Ditch Off Highway 25",
      addrss: "Highway 25, Windsor Exit",
      city: "Loveland",
      state_abr: "CO",
      before_img:
        "http://nykography.weebly.com/uploads/1/1/0/4/11041387/9292659_orig.jpg",
      after_img: "",
      content:
        "I always see this spot on my way home and have decided to go back this Saturday morning to clean it up. More hands would make this quick!"
    },
    {
      id: 4,
      clean: "false",
      title: "Leech Lake",
      addrss: "Leech Lake",
      city: "Pequot",
      state_abr: "MN",
      before_img:
        "https://www.pasadenastarnews.com/wp-content/uploads/2019/06/LDN-L-HOMELESS-COUNT-SGVN-0605-12-SR2.jpg?w=525",
      after_img: "",
      content:
        "So sad to see this beech absolutely trashed by parties and picknickers. Would be wonderful to bring my kids here again if we cleaned it up, but I could really use some help, along with a truck to haul away the refuse."
    }
  ];
}

function makeCleanSitesArray() {
  return [
    {
      id: 5,
      clean: "true",
      title: "Lum Beech - Cleaned!",
      addrss: "413 Lum Beech Rd",
      city: "Bloomington",
      state_abr: "MN",
      before_img:
        "https://www.graziame.com/sites/default/files/graziame/styles/1140_630_wide_landscape/public/images/2019/03/13/dustan-woodhouse-675082-unsplash.jpg?itok=o1_XF_jm",
      after_img:
        "https://media.globalcitizen.org/thumbnails/e4/15/e415fee3-e28a-4d6d-9ce1-ba303d3d5dab/screen_shot_2019-03-11_at_53455_pm.png__1500x670_q85_crop_subsampling-2.png",
      content:
        "Wow we did it! Four of us met up and hauled all the refuse away. Made some new friends and I'll never have to see that trash when I bring my daughter to the beech ever again."
    }
  ];
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "dude",
      email: "cool@email.com",
      password: "cool123",
      score: 25
    },
    {
      id: 2,
      username: "dudette",
      email: "cooler@email.com",
      password: "cold789"
    }
  ];
}

module.exports = { makeTrashSitesArray, makeCleanSitesArray, makeUsersArray };
