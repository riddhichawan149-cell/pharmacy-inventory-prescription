'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('patients', [
      {
        first_name: 'Aarav',
        last_name: 'Shah',
        email: 'aarav.shah@example.com',
        phone: '+91-9000000001',
        date_of_birth: '1990-03-15',
        created_at: now,
        updated_at: now
      },
      {
        first_name: 'Meera',
        last_name: 'Patel',
        email: 'meera.patel@example.com',
        phone: '+91-9000000002',
        date_of_birth: '1985-11-02',
        created_at: now,
        updated_at: now
      }
    ]);
    await queryInterface.bulkInsert('medicines', [
      {
        name: 'Paracetamol 500 mg',
        sku: 'MED-PAR-500',
        category: 'Analgesic',
        unit_price: 2.5,
        stock_quantity: 250,
        reorder_level: 25,
        expiry_date: '2027-12-31',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Cetirizine 10 mg',
        sku: 'MED-CET-010',
        category: 'Antihistamine',
        unit_price: 4.75,
        stock_quantity: 80,
        reorder_level: 15,
        expiry_date: '2027-09-30',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Vitamin C 500 mg',
        sku: 'MED-VTC-500',
        category: 'Supplement',
        unit_price: 1.2,
        stock_quantity: 8,
        reorder_level: 10,
        expiry_date: '2027-06-30',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('prescription_items', null, {});
    await queryInterface.bulkDelete('prescriptions', null, {});
    await queryInterface.bulkDelete('medicines', null, {});
    await queryInterface.bulkDelete('patients', null, {});
  }
};
