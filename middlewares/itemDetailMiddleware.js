const axios = require('axios');

const itemDetailMiddleware = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El parámetro "id" es requerido' });
    }

    try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${id}`);
        const responseDescription = await axios.get(`https://api.mercadolibre.com/items/${id}/description`);
        const author = {
            name: "Camila",
            lastname: "Zuniga"
        };
        const item = {
            id: response.data.id,
            title: response.data.title,
            price: {
                currency: response.data.currency_id,
                amount:  Number.isInteger(response.data.price) ? parseInt(response.data.price) : parseInt((response.data.price).toString().split(".")[0]),
                decimals: Number.isInteger(response.data.price) ? 0 : parseInt((response.data.price).toString().split(".")[1]),
            },
            picture: response.data.pictures[0].url,
            condition: response.data.condition,
            free_shipping: response.data.shipping.free_shipping,
            sold_quantity: response.data.sold_quantity,
            description: responseDescription.data.plain_text
        };

        const responseFormat = {
            author,
            item
        };

        res.json(responseFormat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Mercado Libre' });
    }
};

module.exports = itemDetailMiddleware;
