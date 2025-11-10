export async function displayBoardPage(req, res) {
  res.render("layout.ejs", { page: "board" })
}

export async function displaySocketBoardPage(req, res) {
  if (req?.params?.name?.trim() !== "") {
    return res.render("layout.ejs", {
      page: "socket-board",
      roomName: req?.params?.name,
    })
  }
  res.redirect("/")
}
