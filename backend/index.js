const express = require("express");
const cors = require("cors");
const fs = require("fs");
var http = require("http");
const User = require("./src/models/User");
const Image = require("./src/models/Image");
const multer = require("multer");
const Sequelize = require("sequelize");
const usersServices = require("./src/services/users");
const vaccineServices = require("./src/services/vaccines");
const petServices = require("./src/services/pets");
const petVaccineServices = require("./src/services/petVaccines");
const examServices = require("./src/services/exam");
const appointmentServices = require("./src/services/appointments");

// Iniciliza multer
const upload = multer({ dest: "uploads/" });
const app = express();
app.use(express.json());
app.use(cors());
app.use("/img/", express.static(__dirname + "/uploads"));

// Rotas Rest
/* ---------------------------------- GET --------------------------------- */
// Retorna o usuario, caso esteja logado
app.get("/live", async (req, res) => res.json({ success: true }));
app.get("/", async (req, res) => {
  if (req.headers.authorization) {
    user = await User.findOne({ where: { token: req.headers.authorization } });
    if (!user) return res.json({});
    const { name, id, email } = user;
    return res.json({ name, id, email });
  }
  return res.json({});
});

// Retorna pets do usuário
app.get("/pets", async (req, res) =>
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user) return res.json([]);
    return res.json(await petServices.getPetsByUserId({ user, res }));
  })
);

// Retorna pet por id
app.get("/pet/:id", async (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user) return res.json([]);
    return res.json(
      await petServices.getPetById({ petId: req.params.id, res })
    );
  });
});

// retorna todos os exames do pet
app.get("/pet/exams/:id", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      return res.json(
        await petServices.getPetExamsByPetId({ petId: req.params.id, res })
      );
    });
});

// retorna todos os exames marcados para o usuario levar o pet
app.get("/admin/pets", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user || !user.is_admin) return res.json([]);
      return res.json(await petServices.getAllPets());
    });
});

// retorna todos os exames marcados para o usuario levar o pet
app.get("/pets/history", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      return res.json(
        await petServices.getPetsHistoryByUserId({ userId: user.id })
      );
    });
});

// retorna tudo que o admin precisa pra marcar um exame
app.get("/admin/results/", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user || !user.is_admin) return res.json([]);
      return res.json(await petServices.getPetsResults());
    });
});

app.get("/consultas", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      petServices
        .getPetsByUserId({ user, res })
        .then(async (pets) =>
          res.json(
            await petServices.getPetsAppointmentsByUserId({ userId: user.id, pets })
          )
        );
    });
});

app.get("/admin/consultas", async (req, res) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      where: { token: req.headers.authorization },
    });
    if (!user || !user.is_admin) return;
    return res.json(await petServices.getPetsAppointments());
  }
  return res.json([]);
});

app.get("/pet/consultas/:id", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      return petServices
        .getPetById({
          petId: req.params.id,
          res,
        })
        .then(async ([pet]) =>
          res.json(await petServices.getPetAppointmentsByPetId({ pet }))
        );
    });
});

app.get("/pet/vacinas/:id", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      return res.json(
        await petServices.getPetVaccinesByPetId({ petId: req.params.id })
      );
    });
});

app.get("/admin/vacinas/", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user) return res.json([]);
      return res.json(
        await vaccineServices.getAllVaccines()
      );
    });
});

// Retorna resultados do pet
// TODO: CORRIGIR A QUERY(ESTOU COM FOME VOU COMER)
// app.get("/pet/resultados/:id", async (req, res) => {
//   if (req.headers.authorization) {
//     const user = await User.findOne({
//       where: { token: req.headers.authorization },
//     });
//     if (!user) return;
//     const [pets, metadata] = await db.query(
//       "SELECT * FROM `results` as r JOIN `pets` as p on p.id = r.petId where p.id = ?",
//       { replacements: [req.params.id] }
//     );
//     return res.json(pets);
//   }
//   return res.json([]);
// });

/* ---------------------------------- POST --------------------------------- */
// Faz o login do usuario
app.post("/login", async (req, res) => {
  return res.json(
    await usersServices
      .loginUser({
        email: req.body.email,
        password: req.body.password,
      })
      .then((r) => r)
      .catch((err) => console.error(err))
  );
});

// Faz o login do usuario admin
app.post("/admin/login", async (req, res) =>
  res.json(
    await usersServices.loginAdminUser({
      email: req.body.email,
      password: req.body.password,
    })
  )
);

// Faz o logout do usuario
app.post("/logout", async (req, res) =>
  res.json(await usersServices.logoffUser({ token: req.header.authorization }))
);

// Cadastro do usuario
app.post("/register", async (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user.is_admin) return res.json([]);
      return res.json(await usersServices.createUser(req.body));
    });
});

// Salva imagem
app.post("/image/register", upload.single("photo"), (req, res) => {
  const data = "/img/" + req.file.filename + ".jpg";
  fs.renameSync(
    "./uploads/" + req.file.filename,
    "./uploads/" + req.file.filename + ".jpg"
  );
  Image.create({ data }).then((r) => {
    res.end(`${r.dataValues.id}`);
  });
});

// Faz o registro do pet pelo usuario
app.post("/pet/register", (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user || !user.is_admin) return res.json([]);
      return petServices.createPet({ pet: { ...req.body } }, res);
    });
});

app.post("/result/create", (req, res) => {
  return usersServices
    .getUserByToken(req.headers.authorization)
    .then(async (user) => {
      if (!user || !user.is_admin) return res.json([]);
      return examServices.createPetResult(
        {
          infos: { ...req.body },
          user,
        },
        res
      );
    });
});

// Faz o registro da vacina
app.post("/admin/vacina/create", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return vaccineServices.createVaccine(
      { doses: req.body.doses, name: req.body.name },
      res
    );
  });
});

// Adicionar vacinas necessarias para o pet
app.post("/pet/vacina/create", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return petVaccineServices.addVaccineToPet(
      {
        vaccineId: req.body.vaccineId,
        petId: req.body.petId,
      },
      res
    );
  });
});

//// Adicionar resultado para o pet
//app.post("/resultado/create", (req, res) => {
//  if (req.headers.authorization) {
//    User.findOne({
//      where: { token: req.headers.authorization },
//    }).then(async (user) => {
//      if (!user) return;
//      if (!req.body.petId || !req.body.appointmentId || !req.body.imageId)
//        return res.json({ erro: true, mensagem: "Faltam informacoes" });
//
//      await Result.create({ ...req.body, updatedAt: DateTime.now() })
//        .then((r) =>
//          res.json({
//            erro: false,
//            mensagem: "Resultado adicionado com sucesso",
//            data: r,
//          })
//        );
//    });
//  }
//});

// Adicionar consulta para o pet
app.post("/consulta/create", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return appointmentServices.create(
      {
        date: req.body.date,
        petId: req.body.petId,
      },
      res
    );
  });
});

/* ---------------------------------- PUT --------------------------------- */
app.put("/result/update", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return examServices.updateResult(
      {
        examId: req.body.id,
        imageId: req.body.imageId,
      },
      res
    );
  });
});

app.put("/consulta/cancel/:id", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return appointmentServices.cancelAppointment(
      {
        appointmentId: req.params.id,
      },
      res
    );
  });
});

// Atualizar o consulta
app.put("/consulta/update/", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return appointmentServices.update(
      {
        id: req.body.id,
        description: req.body.description,
        date: req.body.date,
      },
      res
    );
  });
});

// Atualizar o pet
app.put("/pet/update/", (req, res) => {
  console.log(req.body, req.headers)
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user) return;
    console.log(user, req.body)
    return petServices.updatePet(
      {
        petId: req.body.petId,
        imageId: req.body.imageId,
      },
      res
    );
  });
});

// Atualizar que o pet já foi vacinado
app.put("/pet/vacina/update/", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return petVaccineServices.updatePetVaccines(
      {
        vaccineId: req.body.vaccineId,
        petId: req.body.petId,
        date: req.body.date,
      },
      res
    );
  });
});
/* ---------------------------------- DELETE --------------------------------- */
app.delete("/result/delete/:id", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return examServices.deleteResult({ examId: req.params.id }, res);
  });
});

// Adicionar vacinas necessarias para o pet
app.delete("/pet/vacina/delete/:petId/:vaccineId", (req, res) => {
  usersServices.getUserByToken(req.headers.authorization).then(async (user) => {
    if (!user || !user.is_admin) return;
    return petVaccineServices.removeVaccineToPet(
      {
        vaccineId: req.params.vaccineId,
        petId: req.params.petId,
      },
      res
    );
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}: http://localhost:${PORT}`);
});

// module.exports = app
