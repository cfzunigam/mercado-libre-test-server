const axios = require('axios');

const itemDetailMiddleware = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El parámetro "id" es requerido' });
    }

    try {
        // Realizar la consulta a la API de Mercado Libre para obtener los detalles de un item
        const response = await axios.get(`https://api.mercadolibre.com/items/${id}`);

        // Filtrar los datos relevantes que queremos devolver en nuestra API
        const itemDetails = {
            id: response.data.id,
            title: response.data.title,
            price: response.data.price,
            currency_id: response.data.currency_id,
            condition: response.data.condition,
            permalink: response.data.permalink,
            pictures: response.data.pictures.map(pic => pic.url),
            sold_quantity: response.data.sold_quantity,
            description: response.data.descriptions ? response.data.descriptions : ''
        };

        // Responder con los detalles del item
        res.json(itemDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Mercado Libre' });
    }
};

module.exports = itemDetailMiddleware;
