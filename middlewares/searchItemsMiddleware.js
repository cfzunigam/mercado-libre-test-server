const axios = require('axios');

const searchItemsMiddleware = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'El parámetro "q" es requerido' });
    }

    try {
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`);

        const author = {
            name: "Camila",
            lastname: "Zuniga"
        };

        const categoryFilter = response.data.available_filters.find(filter => filter.id === "category");
        const items = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: {
            currency: item.currency_id,
            amount:  Number.isInteger(item.price) ? parseInt(item.price) : parseInt((item.price).toString().split(".")[0]),
            decimals: Number.isInteger(item.price) ? 0 : parseInt((item.price).toString().split(".")[1]),
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping
        }));

        const responseFormat = {
            author,
            category: ["Inicio",categoryFilter ? categoryFilter.values[0].name : ""],
            items: items
        };
        res.json(responseFormat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Mercado Libre' });
    }
};

module.exports = searchItemsMiddleware;
