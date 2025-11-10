export async function displayRootPage(req, res) {
  res.render("layout.ejs", { page: "root" })
}
