const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("Students.json"); // Your database file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser());

// Custom POST API Logic
server.post("/students", (req, res) => {
  const { name, location, phone, courses } = req.body;

  // Check if all required fields are provided
  if (!name || !location || !phone || !Array.isArray(courses)) {
    return res.status(400).json({ message: "Bad Request: Missing required fields." });
  }

  // Check if a student with the same name already exists
  const existingStudent = router.db.get("students").find({ name }).value();
  if (existingStudent) {
    return res.status(409).json({ message: "Student already exists." });
  }

  // Proceed with normal POST behavior
  res.status(201).json({ message: "Student created successfully." });
});

// Custom GET API Logic
server.get("/students/:id", (req, res) => {
  const student = router.db.get("students").find({ id: Number(req.params.id) }).value();

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.status(200).json(student);
});

// Custom PUT API Logic
server.put("/students/:id", (req, res) => {
  const student = router.db.get("students").find({ id: Number(req.params.id) }).value();

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  // Proceed with normal update behavior
  res.status(200).json({ Msg: "Data updated successfully" });
});

// Custom DELETE API Logic
server.delete("/students/:id", (req, res) => {
  const student = router.db.get("students").find({ id: Number(req.params.id) }).value();

  if (!student) {
    return res.status(404).json({ Msg: "Record does not exist" });
  }

  if (student.deleted) {
    return res.status(410).json({ Msg: "Record already deleted" });
  }

  // Perform deletion and mark as deleted instead of removing the record
  router.db.get("students").find({ id: Number(req.params.id) }).assign({ deleted: true }).write();
  res.status(200).json({ Msg: "Record deleted successfully" });
});

// Use JSON Server router
server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});