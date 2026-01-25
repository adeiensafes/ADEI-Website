-- Migration pour ajouter les nouveaux champs responsables et délégués
-- Exécuter ces commandes SQL dans votre base de données

-- Supprimer les anciens champs responsables par section (s'ils existent)
ALTER TABLE `filieres` 
DROP COLUMN IF EXISTS `responsableA1`,
DROP COLUMN IF EXISTS `responsableB1`, 
DROP COLUMN IF EXISTS `responsableC1`,
DROP COLUMN IF EXISTS `responsableA2`,
DROP COLUMN IF EXISTS `responsableB2`,
DROP COLUMN IF EXISTS `responsableC2`;

-- Ajouter le responsable pédagogique commun pour les classes préparatoires
ALTER TABLE `filieres` 
ADD COLUMN `responsablePedagogique` VARCHAR(255) DEFAULT '' COMMENT 'Responsable pédagogique commun pour toutes les classes préparatoires';

-- Ajouter les délégués étudiants pour les sections CP1 (A1, B1, C1)
ALTER TABLE `filieres` 
ADD COLUMN `delegueA1` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section A1',
ADD COLUMN `telDelegueA1` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué A1',
ADD COLUMN `delegueB1` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section B1',
ADD COLUMN `telDelegueB1` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué B1',
ADD COLUMN `delegueC1` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section C1',
ADD COLUMN `telDelegueC1` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué C1';

-- Ajouter les délégués étudiants pour les sections CP2 (A2, B2, C2)
ALTER TABLE `filieres` 
ADD COLUMN `delegueA2` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section A2',
ADD COLUMN `telDelegueA2` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué A2',
ADD COLUMN `delegueB2` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section B2',
ADD COLUMN `telDelegueB2` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué B2',
ADD COLUMN `delegueC2` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant section C2',
ADD COLUMN `telDelegueC2` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué C2';

-- Ajouter le délégué représentant pour les filières
ALTER TABLE `filieres` 
ADD COLUMN `delegueFiliere` VARCHAR(255) DEFAULT '' COMMENT 'Nom complet du délégué étudiant représentant de la filière',
ADD COLUMN `telDelegueFiliere` VARCHAR(20) DEFAULT '' COMMENT 'Numéro de téléphone du délégué de filière';

-- Vérifier la structure de la table
DESCRIBE filieres;