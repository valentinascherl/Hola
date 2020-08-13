const fs = require('fs');
const path = require('path');
const {Products} = require('../database/models');
const {Op} = require("sequelize");

/*const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));*/

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatPrice = (price,discount) => toThousand(Math.round(price*(1-(discount/100))));

const controller = {
	root: async (req, res) => {
		try {
			const products = await Products.findAll();
			res.render("index", {products, formatPrice, toThousand});
		}catch(error){
			res.send("mal ");
		}
	},
	search: async (req, res) => {
		try {
			const results = await Products.findAll({
				where: {
					name: {
						[Op.substring]: req.query.keywords
					}
				}
			});
			res.render("results", {results, formatPrice, toThousand,search: req.query.keywords});
		} catch(error) {
			res.send("bad");
		}
	},
};

module.exports = controller;
