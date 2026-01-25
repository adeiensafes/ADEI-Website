'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('filieres', 'responsableA1', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section A1 pour CP1'
    });
    
    await queryInterface.addColumn('filieres', 'responsableB1', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section B1 pour CP1'
    });
    
    await queryInterface.addColumn('filieres', 'responsableC1', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section C1 pour CP1'
    });
    
    await queryInterface.addColumn('filieres', 'responsableA2', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section A2 pour CP2'
    });
    
    await queryInterface.addColumn('filieres', 'responsableB2', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section B2 pour CP2'
    });
    
    await queryInterface.addColumn('filieres', 'responsableC2', {
      type: Sequelize.STRING(255),
      defaultValue: '',
      comment: 'Responsable section C2 pour CP2'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('filieres', 'responsableA1');
    await queryInterface.removeColumn('filieres', 'responsableB1');
    await queryInterface.removeColumn('filieres', 'responsableC1');
    await queryInterface.removeColumn('filieres', 'responsableA2');
    await queryInterface.removeColumn('filieres', 'responsableB2');
    await queryInterface.removeColumn('filieres', 'responsableC2');
  }
};