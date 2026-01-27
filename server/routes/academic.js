const express = require('express');
const router = express.Router();
const { Cycle, AcademicYear, Section, Filiere } = require('../models');

// Get all cycles with their structure
router.get('/cycles', async (req, res) => {
  try {
    const cycles = await Cycle.findAll({
      include: [
        {
          model: AcademicYear,
          as: 'academicYears',
          include: [
            { model: Section, as: 'sections' },
            { model: Filiere, as: 'filiere' }
          ],
          order: [['order_display', 'ASC']]
        },
        {
          model: Filiere,
          as: 'filieres',
          include: [
            {
              model: AcademicYear,
              as: 'academicYears',
              order: [['year_number', 'ASC']]
            }
          ],
          order: [['order_display', 'ASC']]
        }
      ],
      order: [['type', 'ASC']]
    });

    res.json(cycles);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(500).json({ error: 'Failed to fetch cycles' });
  }
});

// Get cycle préparatoire structure
router.get('/preparatoire', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      where: { type: 'preparatoire' },
      include: [
        {
          model: AcademicYear,
          as: 'academicYears',
          include: [{ model: Section, as: 'sections' }],
          order: [['year_number', 'ASC']]
        }
      ]
    });

    if (!cycle) {
      return res.status(404).json({ error: 'Cycle préparatoire not found' });
    }

    res.json(cycle);
  } catch (error) {
    console.error('Error fetching preparatoire:', error);
    res.status(500).json({ error: 'Failed to fetch cycle préparatoire' });
  }
});

// Get cycle ingénieur structure
router.get('/ingenieur', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      where: { type: 'ingenieur' },
      include: [
        {
          model: Filiere,
          as: 'filieres',
          include: [
            {
              model: AcademicYear,
              as: 'academicYears',
              order: [['year_number', 'ASC']]
            }
          ],
          order: [['order_display', 'ASC']]
        }
      ]
    });

    if (!cycle) {
      return res.status(404).json({ error: 'Cycle ingénieur not found' });
    }

    res.json(cycle);
  } catch (error) {
    console.error('Error fetching ingenieur:', error);
    res.status(500).json({ error: 'Failed to fetch cycle ingénieur' });
  }
});

// Update cycle responsable pédagogique
router.put('/cycles/:id/responsable', async (req, res) => {
  try {
    const { responsable_pedagogique, responsable_contact } = req.body;
    
    const cycle = await Cycle.findByPk(req.params.id);
    if (!cycle) {
      return res.status(404).json({ error: 'Cycle not found' });
    }

    await cycle.update({
      responsable_pedagogique,
      responsable_contact
    });

    res.json(cycle);
  } catch (error) {
    console.error('Error updating cycle responsable:', error);
    res.status(500).json({ error: 'Failed to update cycle responsable' });
  }
});

// Update filière responsable pédagogique
router.put('/filieres/:id/responsable', async (req, res) => {
  try {
    const { responsable_pedagogique, responsable_contact } = req.body;
    
    const filiere = await Filiere.findByPk(req.params.id);
    if (!filiere) {
      return res.status(404).json({ error: 'Filière not found' });
    }

    await filiere.update({
      responsable_pedagogique,
      responsable_contact
    });

    res.json(filiere);
  } catch (error) {
    console.error('Error updating filière responsable:', error);
    res.status(500).json({ error: 'Failed to update filière responsable' });
  }
});

// Update section delegate
router.put('/sections/:id/delegate', async (req, res) => {
  try {
    const { delegate_name, delegate_phone, delegate_email } = req.body;
    
    const section = await Section.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    await section.update({
      delegate_name,
      delegate_phone,
      delegate_email
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating section delegate:', error);
    res.status(500).json({ error: 'Failed to update section delegate' });
  }
});

// Update academic year delegate (for filière years)
router.put('/academic-years/:id/delegate', async (req, res) => {
  try {
    const { delegate_name, delegate_phone } = req.body;
    
    const academicYear = await AcademicYear.findByPk(req.params.id);
    if (!academicYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }

    await academicYear.update({
      delegate_name,
      delegate_phone
    });

    res.json(academicYear);
  } catch (error) {
    console.error('Error updating academic year delegate:', error);
    res.status(500).json({ error: 'Failed to update academic year delegate' });
  }
});

// Get all delegates (for contact purposes)
router.get('/delegates', async (req, res) => {
  try {
    const delegates = [];

    // Get section delegates (CP)
    const sections = await Section.findAll({
      where: {
        delegate_name: { [require('sequelize').Op.ne]: null }
      },
      include: [
        {
          model: AcademicYear,
          as: 'academicYear',
          include: [{ model: Cycle, as: 'cycle' }]
        }
      ]
    });

    sections.forEach(section => {
      if (section.delegate_name) {
        delegates.push({
          type: 'section',
          name: section.delegate_name,
          phone: section.delegate_phone,
          email: section.delegate_email,
          position: `Délégué ${section.academicYear.name} Section ${section.name}`,
          cycle: section.academicYear.cycle.name
        });
      }
    });

    // Get academic year delegates (Filières)
    const academicYears = await AcademicYear.findAll({
      where: {
        delegate_name: { [require('sequelize').Op.ne]: null },
        filiere_id: { [require('sequelize').Op.ne]: null }
      },
      include: [
        { model: Filiere, as: 'filiere' },
        { model: Cycle, as: 'cycle' }
      ]
    });

    academicYears.forEach(year => {
      if (year.delegate_name) {
        delegates.push({
          type: 'year',
          name: year.delegate_name,
          phone: year.delegate_phone,
          position: `Délégué ${year.name}`,
          filiere: year.filiere.name,
          cycle: year.cycle.name
        });
      }
    });

    res.json(delegates);
  } catch (error) {
    console.error('Error fetching delegates:', error);
    res.status(500).json({ error: 'Failed to fetch delegates' });
  }
});

module.exports = router;