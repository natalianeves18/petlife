require("dotenv").config();
const db = require("../src/models/db");
const User = require("../src/models/User");
const Pet = require("../src/models/Pet");
const Vaccine = require("../src/models/Vaccine");
const PetVaccine = require("../src/models/PetVaccine");
const Appointment = require("../src/models/Appointment");
const Image = require("../src/models/Image");
const Exam = require("../src/models/Exam");
const Result = require("../src/models/Result");

const shouldForce =
  process.env.DB_FORCE === "true" || process.env.SEED_FORCE === "true";

const run = async () => {
  await db.authenticate();
  await db.sync({ force: shouldForce });

  const [adminUser, regularUser] = await Promise.all([
    User.create({
      name: "Admin",
      email: "admin@petlife.local",
      password: "admin123",
      is_admin: true,
      token: null,
    }),
    User.create({
      name: "Cliente",
      email: "cliente@petlife.local",
      password: "cliente123",
      is_admin: false,
      token: null,
    }),
  ]);

  const pet = await Pet.create({
    userId: regularUser.id,
    name: "Thor",
    species: "Cachorro",
    race: "Labrador",
    birthday: new Date("2021-05-10"),
    sex: "M",
    color: "Caramelo",
    imageId: null,
  });

  const [vaccineA, vaccineB] = await Promise.all([
    Vaccine.create({ name: "V8", vaccineId: null }),
    Vaccine.create({ name: "Raiva", vaccineId: null }),
  ]);

  await Promise.all([
    PetVaccine.create({
      vaccineId: vaccineA.id,
      petId: pet.id,
      vaccinatedAt: new Date("2024-01-15"),
      createdAt: new Date(),
    }),
    PetVaccine.create({
      vaccineId: vaccineB.id,
      petId: pet.id,
      vaccinatedAt: new Date("2024-06-20"),
      createdAt: new Date(),
    }),
  ]);

  const appointment = await Appointment.create({
    petId: pet.id,
    description: "Consulta de rotina",
    date: new Date(),
    deletedAt: null,
  });

  const image = await Image.create({
    type: "image/jpeg",
    name: "exame-exemplo.jpg",
    data: "/img/exame-exemplo.jpg",
  });

  await Exam.create({
    userId: regularUser.id,
    petId: pet.id,
    imageId: image.id,
    date: new Date(),
  });

  await Result.create({
    imageId: image.id,
    petId: pet.id,
    appointmentId: appointment.id,
    updatedAt: new Date(),
  });

  console.log("Seed concluído.");
  console.log("Login admin: admin@petlife.local / admin123");
  console.log("Login cliente: cliente@petlife.local / cliente123");
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erro no seed:", err);
    process.exit(1);
  });
