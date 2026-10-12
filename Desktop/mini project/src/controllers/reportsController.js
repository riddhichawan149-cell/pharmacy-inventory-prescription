const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function inventory(req, res) {
  const category = req.query.category || null;
  const lowStock = req.query.lowStock === 'true';
  const rows = await sequelize.query(`
    SELECT
      m.id,
      m.name,
      m.sku,
      m.category,
      m.unit_price AS unitPrice,
      m.stock_quantity AS stockQuantity,
      m.reorder_level AS reorderLevel,
      COALESCE(SUM(CASE WHEN p.status = 'billed' THEN pi.quantity ELSE 0 END), 0) AS unitsDispensed,
      COALESCE(SUM(CASE WHEN p.status = 'billed' THEN pi.line_total ELSE 0 END), 0) AS salesRevenue
    FROM medicines AS m
    LEFT JOIN prescription_items AS pi ON pi.medicine_id = m.id
    LEFT JOIN prescriptions AS p ON p.id = pi.prescription_id
    WHERE (:category IS NULL OR m.category = :category)
      AND (:lowStock = FALSE OR m.stock_quantity <= m.reorder_level)
    GROUP BY m.id, m.name, m.sku, m.category, m.unit_price, m.stock_quantity, m.reorder_level
    ORDER BY m.category ASC, m.name ASC
  `, {
    replacements: { category, lowStock },
    type: QueryTypes.SELECT
  });
  res.json({ data: rows, filters: { category, lowStock } });
}

module.exports = { inventory };
