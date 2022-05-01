const express = require('express');
const joyas = require('./data/joyas.js');
const app = express();
const port = 3000;

//version 1 muestra el nombre y link para ver detalle del producto
// http://localhost:3000/api/v1/joyas
const HATEOASV1 = () => {
  const result = joyas.map(joya => {
    return {
      Nombre: joya.name,
      Detalle: `http://localhost:3000/joya/${joya.id}`,
    }
  });
  return result;
};

//version 1 muestra el nombre, precio y link para ver detalle del producto
// http://localhost:3000/api/v2/joyas
const HATEOASV2 = () => {
  const result = joyas.map(joya => {
    return {
      Nombre: joya.name,
      Precio: joya.value,
      Detalle: `http://localhost:3000/joya/${joya.id}`,
    }
  });
  return result;
};

//busca la joya por id
const joya = (id) => {
  const result = joyas.find(joya => joya.id === Number(id));
  return result;
};

//filtra la joya por categoria
const filtrarPorCategoria = (category) => {
  const result = joyas.filter(joya => joya.category === category);
  return result;
};

//para buscar por campos el producto
const seleccionarCampos = (joya, fields) => {
  for (propiedad in joya) {
    if (!fields.includes(propiedad)) delete joya[propiedad];
  }
  return joya;
};

//ordena por valores ya sea descendiente a acendiente
const ordenarPorValores = (order) => {
  if (order === 'asc') {
    return joyas.sort((a, b) => a.value - b.value);
  }
  if (order === 'desc') {
    return joyas.sort((a, b) => b.value - a.value);
  } else {
    console.log(e);
  }
};

// http://localhost:3000
app.get('/', (req, res) => {
  res.send('Oh wow! this is working =)')
})

// http://localhost:3000/api/v1/joyas este muestra las 6 joyas del json
app.get('/api/v1/joyas', (req, res) => {
  res.send({
    joyas: HATEOASV1(),
  })
});

// http://localhost:3000/api/v2/joyas?values=asc o desc

// http://localhost:3000/api/v2/joyas?page=1

app.get('/api/v2/joyas', (req, res) => {
  const { values } = req.query;
  if (values === "asc") return res.send(ordenarPorValores("asc"));
  if (values === "desc") return res.send(ordenarPorValores("desc"));
  if (req.query.page) {
    const { page } = req.query;
    return res.send({ joyas: HATEOASV2().slice(page * 2 - 2, page * 2) });
  }
  res.send({
    joyas: HATEOASV2(),
  })
});

// http://localhost:3000/joya/1 o hasta el 6
app.get('/joya/:id', (req, res) => {
  const { id } = req.params;
  res.send(joya(id));
});

// http://localhost:3000/api/v2/category/collar, aros o anillo
app.get('/api/v2/category/:category', (req, res) => {
  const { category } = req.params;
  if (!joyas.find(joya => joya.category === category)) {
    res.send(`La categoria ingresada no esta en nuestro catalogo
    por los momentos te podemos ofrecer: anillo, aros y collar`);
  }
  res.send({
    cant: filtrarPorCategoria(category).length,
    joyas: filtrarPorCategoria(category)
  });
});

// http://localhost:3000/api/v2/joya/1?fields=id,name,metal,value,stock
app.get('/api/v2/joya/:id', (req, res) => {
  const { id } = req.params;
  const { fields } = req.query;
  if (fields) return res.send({ joya: seleccionarCampos(joya(id), fields.split(",")) });
  joya(id) ? res.send({ joyas: joya(id) }) : res.status(404).send({ error: "404 Not Found", 
  message: "la joyeria no cuenta con un producto con ese ID" });
});

app.listen(3000, () => console.log(`Your app listening on port: ${port}.`));