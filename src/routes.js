const express = require("express");

const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
  data: {
    name: "Levi",
    avatar: "https://avatars.githubusercontent.com/u/62621313?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },

  controllers: {
    index(req, res) {
      return res.render(views + "profile", { profile: Profile.data });
    },

    update(req, res) {
      /**
       * - req.body para pegar os dados
       * - definir quantas semanas tem e um ano
       * - remover as semanas de férias
       * - qts horas estou trabalhando
       * - total de horas trabalhadas no mês
       */
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data["value-hour"] * job["total-hours"],
        };
      });

      return res.render(views + "index", { jobs: updatedJobs });
    },

    save(req, res) {
      // pega o último id, se n tiver, vai ser 1
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(),
      });

      return res.redirect("/");
    },

    create(req, res) {
      return res.render(views + "job");
    },
  },

  services: {
    remainingDays(job) {
      // dias restantes. Horas totais do projeto / horas diárias.
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

      // crio a data em um formato grande do dia da tarefa criada
      const createdDate = new Date(job.created_at);

      // vejo qual que é o dia do mês que irá terminar.
      /**
       * .getDate() pega o dia exato que foi criado, ex: 1 de janeiro.
       * e soma-se ao restante de dias que tenho que trabalhar.
       * ex: 1 de janeiro + 20 dias = 21 de janeiro
       **/
      const dueDay = createdDate.getDate() + Number(remainingDays);

      // coloco a nova data que será a final in ms
      const dueDateInMs = createdDate.setDate(dueDay);

      // tempo de diferença em milissegundos. O dia final - hoje
      const timeDiffInMs = dueDateInMs - Date.now();

      // transforma 1 dia em milissegundos
      const dayInMs = 1000 * 60 * 60 * 24;

      // transformar a diferença que está como mili em dias, restam x dias
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    },
  },
};

routes.get("/", Job.controllers.index);

routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);

routes.get("/jobedit", (req, res) => res.render(views + "job-edit"));

routes.get("/profile", Profile.controllers.index);
routes.get("/post", Profile.controllers.update);

module.exports = routes;
