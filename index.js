const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

app.use(express.json());

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  const jsonData = fs.readFileSync(path.join(__dirname, "data.json"));
  res.send(jsonData);
});

app.post("/", (req, res) => {
  const jsonData = fs.readFileSync(path.join(__dirname, "data.json"));
  const Data = JSON.parse(jsonData);

  const newRecord = {
    id: Data.length + 1,
    name: req.body.name,
    age: req.body.age,
  };

  Data.push(newRecord);

  fs.writeFileSync(
    path.join(__dirname, "data.json"),
    JSON.stringify(Data),
    "utf-8"
  );

  const updatedData = fs.readFileSync(
    path.join(__dirname, "data.json"),
    "utf-8"
  );

  res.send(updatedData);
});

app.put("/:id" , async (req, res) => {

    try{
        const idToUpdate = parseInt(req.params.id);
        const updatedName = req.body.name;
        const updatedAge = req.body.age;

        const existingData = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8");
        const jsonData = JSON.parse(existingData);

        const updatedData = jsonData.map((record) => {
            if(record.id === idToUpdate){
                return {
                    id: record.id,
                    name: updatedName,
                    age: updatedAge
                }
            } else {
                return record;
            }
        });

        fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(updatedData), "utf-8");

        res.send(`Updated record with ID ${idToUpdate}
        `);
    }  catch(err) {
        res.status(500).send("Record not found");
    }
});

app.delete("/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id);

    // Read the existing data from the file
    const existingData = fs.readFileSync(
      path.join(__dirname, "data.json"),
      "utf-8"
    );
    const jsonData = JSON.parse(existingData); // Parse the existing data into an array

    // Use the filter method to create a new array without the record to be deleted
    const updatedData = jsonData.filter((record) => record.id !== idToDelete);
    console.log(`updated data:`, updatedData);

    // Check if any record was removed
    if (jsonData.length !== updatedData.length) {
      // Write the updated data back to the file
      fs.writeFileSync(
        path.join(__dirname, "data.json"),
        JSON.stringify(updatedData),
        "utf-8"
      );

      res.send(`Deleted record with ID ${idToDelete}`);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("500 error");
  }
});

