-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : mar. 13 jan. 2026 à 21:04
-- Version du serveur : 8.0.44 (Compatible avec versions antérieures)
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `adei_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `adei_members`
--

CREATE TABLE `adei_members` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('President','Vice President','Secrétaire Générale','Trésorier','Conseillers','IT Manager','IT Team','Représentant des étudiants étrangers','Représentant des Lauréats','Affaires Administratives','Responsable Media','Responsable Interne','Responsables Sponsoring','Responsables Création & Design') NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(500) DEFAULT '/images/default.jpg',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `adei_members`
--

INSERT INTO `adei_members` (`id`, `name`, `role`, `email`, `photo`, `createdAt`, `updatedAt`) VALUES
(1, 'Moslim Ar', 'President', 'moslimlaarabi@gmail.com', '/uploads/1767824404082-485020667.jpg', '2026-01-07 22:20:04', '2026-01-07 22:20:04');

-- --------------------------------------------------------

--
-- Structure de la table `clubs`
--

CREATE TABLE `clubs` (
  `id` int NOT NULL,
  `club` varchar(255) NOT NULL,
  `president` varchar(255) NOT NULL,
  `annees_etude` varchar(100) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `website` varchar(500) DEFAULT '',
  `image` varchar(500) DEFAULT '',
  `observations` text,
  `description` text,
  `activities` json DEFAULT NULL,
  `achievements` json DEFAULT NULL,
  `members` json DEFAULT NULL,
  `meetings` varchar(500) DEFAULT '',
  `socialMedia` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `clubs`
--

INSERT INTO `clubs` (`id`, `club`, `president`, `annees_etude`, `tel`, `email`, `website`, `image`, `observations`, `description`, `activities`, `achievements`, `members`, `meetings`, `socialMedia`, `createdAt`, `updatedAt`) VALUES
(2, 'The Great Debaters ENSA Fes', 'ALALOUCHE Walid', 'CI2', '0656790553', 'walidalalouche12@gmail.com', '', '/uploads/1768082950064-833336337.png', '', 'The Great Debaters ENSAF est un club académique fondé en 2018, dédié à la promotion de l''art oratoire et du débat sous toutes ses formes. Chaque année, le club recrute jusqu''à une centaine de membres et propose trois sections – français, anglais et arabe – permettant à chacun de s''exprimer dans la langue qui lui convient le mieux.\\n\\nL''objectif du club est double : développer les compétences en communication, esprit critique et leadership de ses membres à travers la formation et la pratique régulière, tout en valorisant l''aspect compétitif du débat en participant aux tournois nationaux. Grâce à cette approche, le club a remporté de nombreux trophées et s''est imposé comme un acteur majeur de la scène du débat au Maroc.\\n\\nEn plus de sa participation aux compétitions, The Great Debaters ENSAF organise deux événements phares : l''All-Star Debate, qui réunit les meilleurs débatteurs de la communauté nationale, et LeLaplacien, une compétition destinée à mettre en lumière les jeunes talents rookies de la scène fassie.\\n\\nAlliant rigueur académique, esprit de compétition et convivialité, le club offre à ses membres un espace unique pour apprendre, s''exprimer et grandir.', '[]', '[]', '[]', '', '{\"contact\": \"thegreatdebaters.ensaf@gmail.com\", \"facebook\": \"https://www.facebook.com/THEGREATDEBATERSENSAF\", \"linkedin\": \"https://www.linkedin.com/company/the-great-debaters-ensa-fez/\", \"instagram\": \"https://www.instagram.com/tgd_ensaf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==\"}', '2026-01-10 22:08:06', '2026-01-10 22:30:49'),
(3, 'Hult Prize ENSAF', 'Boustiti Amine', 'CI2', '', 'amine.boustiti@usmba.ac.ma', '', '', '', 'The Hult Prize is a global movement that challenges students to solve the world''s most pressing social issues through entrepreneurship.', '[]', '[]', '[]', '', '{\"contact\": \"hultprizeensaf28@gmail.com\"}', '2026-01-10 22:10:10', '2026-01-10 22:10:10'),
(4, 'HardSoft Developers ENSA FÈS', 'Imane Meslaha', 'CI2', '', 'amounaimana12@gmail.com', '', '', '', 'Le Club HardSoft est un espace d''apprentissage et de partage autour du développement logiciel et matériel.', '[]', '[]', '[]', '', '{\"contact\": \"https://www.instagram.com/hardsoft_ensaf\"}', '2026-01-10 22:10:28', '2026-01-10 22:10:28'),
(5, 'Mechatronics Trendz', 'Boustiti Amine', 'CI2', '', 'boustitiamine3@gmail.com', '', '', '', 'Le but du club est de promouvoir la mécatronique à travers des projets innovants et des activités techniques.', '[]', '[]', '[]', '', '{\"contact\": \"https://www.linkedin.com/company/mechatronics-trendz\"}', '2026-01-10 22:11:15', '2026-01-10 22:11:15'),
(6, 'ENACTUS ENSAF', 'Fechtali Reda', 'CI1', '', 'htazi435@gmail.com', '', '', '', 'Club dédié à l''entrepreneuriat social et au développement durable à travers des projets à impact.', '[]', '[]', '[]', '', '{\"contact\": \"https://www.instagram.com/e.n.a.c.t.u.s_ensaf\"}', '2026-01-10 22:11:31', '2026-01-10 22:11:31');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` enum('avis','recommandation','autre') NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id` int NOT NULL,
  `name` varchar(500) NOT NULL COMMENT 'Nom complet de la filière',
  `abbreviation` varchar(20) NOT NULL COMMENT 'Abréviation de la filière (ex: ISCSI, INFO, GM)',
  `type` enum('filiere','prepa') NOT NULL DEFAULT 'filiere' COMMENT 'Type: filiere pour les filières d''ingénierie, prepa pour les classes préparatoires',
  `years` json DEFAULT NULL COMMENT 'Liste des années d''étude (ex: [\"INFO1\", \"INFO2\", \"INFO3\"])',
  `documentation` varchar(1000) DEFAULT '' COMMENT 'Lien vers la documentation officielle',
  `drive` varchar(1000) DEFAULT '' COMMENT 'Lien vers le drive de la filière',
  `responsable` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'À définir' COMMENT 'Nom du délégué de la filière',
  `RespoContact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Contact du délégué (email ou téléphone)',
  `description` text COMMENT 'Description détaillée de la filière',
  `isActive` tinyint(1) DEFAULT '1' COMMENT 'Indique si la filière est active',
  `order_display` int DEFAULT '0' COMMENT 'Ordre d''affichage',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `name`, `abbreviation`, `type`, `years`, `documentation`, `drive`, `responsable`, `RespoContact`, `description`, `isActive`, `order_display`, `createdAt`, `updatedAt`) VALUES
(15, 'Ingénierie des Systèmes Communicants et Sécurité Informatique', 'ISCSI', 'filiere', '[\"ISCSI1\", \"ISCSI2\", \"ISCSI3\"]', 'https://docs.ensaf.ac.ma/home/fil/ISCSN.pdf', '', 'À définir', '', 'Formation spécialisée dans les systèmes communicants et la sécurité informatique.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(16, 'Ingénierie Informatique, Intelligence Artificielle et Confiance Numérique', '3IACN', 'filiere', '[\"3IACN1\", \"3IACN2\", \"3IACN3\"]', 'https://docs.ensaf.ac.ma/home/fil/3IACN.pdf', '', 'À définir', '', 'Formation en informatique avec spécialisation en IA et confiance numérique.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(17, 'Ingénierie des Systèmes Embarqués et Intelligence Artificielle', 'ISEIA', 'filiere', '[\"ISEIA1\", \"ISEIA2\", \"ISEIA3\"]', 'https://docs.ensaf.ac.ma/home/fil/ISEIA.pdf', '', 'À définir', '', 'Formation en systèmes embarqués et intelligence artificielle.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(18, 'Ingénierie Logicielle et Intelligence Artificielle', 'ILIA', 'filiere', '[\"ILIA1\", \"ILIA2\", \"ILIA3\"]', 'https://docs.ensaf.ac.ma/home/fil/ILIAV2.pdf', '', 'À définir', '', 'Formation en ingénierie logicielle et intelligence artificielle.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(19, 'Génie du développement numérique et Cybersécurité', 'GDNC', 'filiere', '[\"GDNC1\", \"GDNC2\", \"GDNC3\"]', 'https://docs.ensaf.ac.ma/home/fil/DNC.pdf', '', 'À définir', '', 'Formation en développement numérique et cybersécurité.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(20, 'Ingénierie en Science de Données et Intelligence Artificielle', 'ISDIA', 'filiere', '[\"ISDIA1\", \"ISDIA2\", \"ISDIA3\"]', 'https://docs.ensaf.ac.ma/home/fil/ISDIAV3.pdf', '', 'À définir', '', 'Formation en science de données et intelligence artificielle.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(21, 'Génie Informatique', 'INFO', 'filiere', '[\"INFO1\", \"INFO2\", \"INFO3\"]', 'https://docs.ensaf.ac.ma/home/fil/INFO.pdf', '', 'test ', '', 'Formation généraliste en génie informatique.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 21:00:31'),
(22, 'Génie Mécanique', 'GM', 'filiere', '[\"GM1\", \"GM2\", \"GM3\"]', 'https://docs.ensaf.ac.ma/home/fil/GM.pdf', '', 'À définir', '', 'Formation en génie mécanique et systèmes mécaniques.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(23, 'Génie Energétique et systèmes intelligents', 'GESI', 'filiere', '[\"GESI1\", \"GESI2\", \"GESI3\"]', 'https://docs.ensaf.ac.ma/home/fil/GESI.pdf', '', 'À définir', '', 'Formation en génie énergétique et systèmes intelligents.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(24, 'Génie Mécatronique', 'GMT', 'filiere', '[\"GMT1\", \"GMT2\", \"GMT3\"]', 'https://docs.ensaf.ac.ma/home/fil/GMT.pdf', '', 'À définir', '', 'Formation en génie mécatronique alliant mécanique, électronique et informatique.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(25, 'Génie Industriel', 'GIND', 'filiere', '[\"GIND1\", \"GIND2\", \"GIND3\"]', 'https://docs.ensaf.ac.ma/home/fil/gind.pdf', '', 'À définir', '', 'Formation en génie industriel et optimisation des processus.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28'),
(26, 'Classes Préparatoires Intégrées', 'CPI', 'prepa', '[\"CPI1\", \"CPI2\"]', '', '', 'À définir', '', 'Cycle préparatoire de 2 ans préparant aux études d''ingénieur.', 1, 0, '2026-01-13 20:56:28', '2026-01-13 20:56:28');

-- --------------------------------------------------------

--
-- Structure de la table `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'adei_ensa@gmail.com', '$2b$10$TIz35F8DaPJL/l7mBpi5v.z7rToZL8.fGn6JuWFvpcQlfY4oAGmb.', 'admin', '2026-01-04 18:52:10', '2026-01-04 18:52:10'),
(2, 'Moslim Ar', 'moslimarabi86@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '2026-01-04 18:56:38', '2026-01-04 18:56:38'),
(3, 'Moslim 2', 'moslimlaarabi@gmail.com', '$2b$10$9QrrNSSDVKSNxfzSIVNc9eiPDxXO2Y.Nvla6AlY0G6OvUF1zlFvQq', 'user', '2026-01-04 19:38:26', '2026-01-07 22:28:46');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adei_members`
--
ALTER TABLE `adei_members`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `abbreviation` (`abbreviation`),
  ADD KEY `idx_abbreviation` (`abbreviation`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_active` (`isActive`),
  ADD KEY `idx_order` (`order_display`),
  ADD KEY `filieres_abbreviation` (`abbreviation`),
  ADD KEY `filieres_type` (`type`),
  ADD KEY `filieres_is_active` (`isActive`),
  ADD KEY `filieres_order_display` (`order_display`);

--
-- Index pour la table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adei_members`
--
ALTER TABLE `adei_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;