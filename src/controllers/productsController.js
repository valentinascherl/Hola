const fs = require('fs');
const path = require('path');
const {Products} = require('../database/models');
const {validationResult} = require("express-validator");
const db = require("../database/models");

/*const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const saveProducts = (array => fs.writeFileSync(productsFilePath, JSON.stringify(array)));*/

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatPrice = (price,discount) => toThousand(Math.round(price*(1-(discount/100))));








const controller = {
	// Root - Show all products
	root: async (req, res) => {
		try{
			const products = await Products.findAll();
		// Do the magic });
		   res.render('products', {productosAMostrar: products, toThousand, formatPrice});
		}catch(error){
			res.render("error", {error});
		}
	},

	// Detail - Detail from one product
	detail: async (req, res) => {
		try {
			const productFind = await Products.findOne({
				where: {
					id: parseInt(req.params.id),
					category: req.params.category
				}
			});
			res.render("detail", {productFind, formatPrice, toThousand});
		} catch(error) {
			res.render("error", {error});
		}

	},

	// Create - Form to create
	create: async (req, res) => {
		try {
			res.render("product-create-form");
		} catch(error) {
			res.render("error", {error});
		}
	},
	// Create -  Method to store
	store: (req, res) => {
		Products.create({
			name: req.body.name,
			code: parseFloat(req.body.code),
			price: parseFloat(req.body.price),
			discount: parseFloat(req.body.discount),
			category: req.body.category,
			description: req.body.description,
			image: req.body.image
        })
    
        res.redirect("/products");
	},

	// Update - Form to edit
	edit: async (req, res) => {
		try {
			const productToEdit = await Products.findByPk(req.params.id);
			res.render("product-edit-form", {productToEdit});
		} catch(error) {
			res.render("error", {error});
		}
	},
	// Update - Method to update
	update: async (req, res) => {
		try {
			let errors = validationResult(req);
			if (errors.isEmpty()) {
				await Products.update({
					name: req.body.name,
					price: parseFloat(req.body.price),
					discount: parseInt(req.body.discount),
					category: req.body.category,
					description: req.body.description
				}, {
					where: {
						id: req.params.id
					}
				});
				res.redirect("/products");
			} else {
				const productToEdit = await Products.findByPk(req.params.id);
				res.render("product-edit-form", {errors: errors.errors, productToEdit});
			}
		} catch(error) {
			res.render("error", {error});
		}
	},

	// Delete - Delete one product from DB
	destroy : async (req, res) => {
		try {
			const product = await Products.findByPk(req.params.id);
			await Products.destroy({
				where: {
					id: req.params.id
				}
			});
			res.redirect("/products");
		} catch(error) {
			res.render("error", {error});
		}
	}
};

module.exports = controller;