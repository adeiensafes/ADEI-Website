-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 28 jan. 2026 à 19:03
-- Version du serveur : 10.5.29-MariaDB
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `adeiensa_adei_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Nom de l''année (CP1, CP2, GTR1, etc.)',
  `year_number` int(11) NOT NULL COMMENT 'Numéro de l''année (1, 2, 3)',
  `cycle_id` int(11) NOT NULL COMMENT 'ID du cycle parent',
  `filiere_id` int(11) DEFAULT NULL COMMENT 'ID de la filière (null pour cycle préparatoire)',
  `has_sections` tinyint(1) DEFAULT 0 COMMENT 'Indique si cette année a des sections (A, B, C)',
  `delegate_name` varchar(255) DEFAULT NULL COMMENT 'Nom du délégué étudiant',
  `delegate_phone` varchar(20) DEFAULT NULL COMMENT 'Téléphone du délégué étudiant',
  `documentation` varchar(1000) DEFAULT NULL COMMENT 'Lien vers la documentation',
  `drive` varchar(1000) DEFAULT NULL COMMENT 'Lien vers le drive',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Indique si l''année est active',
  `order_display` int(11) DEFAULT 0 COMMENT 'Ordre d''affichage',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `academic_years`
--

INSERT INTO `academic_years` (`id`, `name`, `year_number`, `cycle_id`, `filiere_id`, `has_sections`, `delegate_name`, `delegate_phone`, `documentation`, `drive`, `isActive`, `order_display`, `createdAt`, `updatedAt`) VALUES
(1, 'CP1', 1, 1, NULL, 1, NULL, NULL, NULL, NULL, 1, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(2, 'CP2', 2, 1, NULL, 1, NULL, NULL, NULL, NULL, 1, 2, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(3, 'GTR1', 1, 2, 2, 0, 'Délégué GTR1', '0600000003', NULL, NULL, 1, 21, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(4, 'GI1', 1, 2, 3, 0, 'Délégué GI1', '0600000004', NULL, NULL, 1, 31, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(5, 'GC1', 1, 2, 4, 0, 'Délégué GC1', '0600000005', NULL, NULL, 1, 41, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(6, 'GE1', 1, 2, 5, 0, 'Délégué GE1', '0600000006', NULL, NULL, 1, 51, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(7, 'GM1', 1, 2, 6, 0, 'Délégué GM1', '0600000007', NULL, NULL, 1, 61, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(10, 'GTR2', 2, 2, 2, 0, 'Délégué GTR2', '0600000010', NULL, NULL, 1, 22, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(11, 'GI2', 2, 2, 3, 0, 'Délégué GI2', '0600000011', NULL, NULL, 1, 32, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(12, 'GC2', 2, 2, 4, 0, 'Délégué GC2', '0600000012', NULL, NULL, 1, 42, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(13, 'GE2', 2, 2, 5, 0, 'Délégué GE2', '0600000013', NULL, NULL, 1, 52, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(14, 'GM2', 2, 2, 6, 0, 'Délégué GM2', '0600000014', NULL, NULL, 1, 62, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(17, 'GTR3', 3, 2, 2, 0, 'Délégué GTR3', '0600000017', NULL, NULL, 1, 23, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(18, 'GI3', 3, 2, 3, 0, 'Délégué GI3', '0600000018', NULL, NULL, 1, 33, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(19, 'GC3', 3, 2, 4, 0, 'Délégué GC3', '0600000019', NULL, NULL, 1, 43, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(20, 'GE3', 3, 2, 5, 0, 'Délégué GE3', '0600000020', NULL, NULL, 1, 53, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(21, 'GM3', 3, 2, 6, 0, 'Délégué GM3', '0600000021', NULL, NULL, 1, 63, '2026-01-28 00:33:34', '2026-01-28 00:33:34');

-- --------------------------------------------------------

--
-- Structure de la table `adei_members`
--

CREATE TABLE `adei_members` (
  `id` int(11) NOT NULL,
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
(8, 'Dhirech Yassir', 'President', 'yassir.dhirech@usmba.ac.ma', '/uploads/1769349240849-910402136.jpg', '2026-01-25 13:54:04', '2026-01-28 22:47:11'),
(9, 'Alalouch Walid', 'Affaires Administratives', 'walid.alalouch@usmba.ac.ma', '/uploads/1769639375908-340996505.jpeg', '2026-01-25 13:55:48', '2026-01-28 22:29:35'),
(10, 'Sabbah Soulaymane', 'Vice President', 'Soulaymane.sabbah@usmba.ac.ma', '/uploads/1769639248136-563604373.jpeg', '2026-01-25 07:59:57', '2026-01-28 22:27:28'),
(11, 'Tlemcany Yahya', 'Secrétaire Générale', 'yahya.tlemcany@usmba.ac.ma', '/uploads/1769636923455-262660128.jpeg', '2026-01-25 14:06:06', '2026-01-28 21:48:43'),
(12, 'El Baouchi Anas', 'Trésorier', 'anas.el.baouchi@usmba.ac.ma', '/uploads/1769639278935-833823525.jpeg', '2026-01-25 14:06:45', '2026-01-28 22:27:58'),
(13, 'Ouazahoum Sihame', 'Responsable Media', 'sihame.ouazahoume@usmba.ac.ma', '/uploads/1769636885824-816066212.jpeg', '2026-01-25 14:07:48', '2026-01-28 21:48:05'),
(14, 'Bounacer Hind', 'Responsables Création & Design', 'hind.bounacer@usmba.ac.ma', '/uploads/1769639648948-203723656.jpeg', '2026-01-25 14:08:23', '2026-01-28 22:34:08'),
(15, 'El Mehdi Squalli', 'Responsables Création & Design', 'mehdi.squalli@usmba.ac.ma', '/uploads/1769636276923-287567704.jpeg', '2026-01-25 14:09:47', '2026-01-28 21:37:56'),
(16, 'Kouach Ihssane', 'Responsable Media', 'ihssane.kouach@usmba.ac.ma', '/uploads/1769639299822-502385470.jpeg', '2026-01-25 14:10:26', '2026-01-28 22:28:19'),
(17, 'El ouardi hajar', 'Responsables Sponsoring', 'hajar.ouardi@usmba.ac.ma', '/uploads/1769636239462-80497350.jpeg', '2026-01-25 14:11:01', '2026-01-28 21:37:19'),
(18, 'Ammouta manal', 'Responsables Sponsoring', 'manal.ammouta@usmba.ac.ma', '/uploads/1769636214878-877081752.jpeg', '2026-01-25 14:11:34', '2026-01-28 21:36:54'),
(19, 'Benzekri Sara', 'Responsables Sponsoring', 'sara.benzekri@usmba.ac.ma', '/uploads/1769635849624-262350351.jpeg', '2026-01-25 14:12:14', '2026-01-28 21:30:49'),
(20, 'Attilah Akram', 'Conseillers', 'akram.attilah@usmba.ac.ma', '/uploads/1769639233597-954189706.jpeg', '2026-01-25 14:12:53', '2026-01-28 22:27:13'),
(21, 'Mekrane Niama', 'Conseillers', 'niama.mekrane@usmba.ac.ma', '/uploads/1769640399128-729705222.jpg', '2026-01-25 14:13:26', '2026-01-28 22:46:39'),
(22, 'Ngakosso Megrand', 'Représentant des étudiants étrangers', 'megrand.a@usmba.ac.ma', '/uploads/1769636187304-263254838.jpeg', '2026-01-25 14:14:37', '2026-01-28 22:08:58'),
(23, 'EL Hannach Walid', 'Représentant des Lauréats', 'el.ahs@usmba.ac.ma', '/uploads/1769636162450-360771693.jpeg', '2026-01-25 14:15:08', '2026-01-28 21:36:02'),
(24, 'Dinari Mehdi', 'IT Manager', 'mehdi@usmba.ac.ma', '/uploads/1769636144193-737181437.jpeg', '2026-01-25 14:15:46', '2026-01-28 21:35:44'),
(25, 'Chou Naima ', 'IT Team', 'chou@usmba.ac.ma', '/uploads/1769636111098-691327321.jpeg', '2026-01-25 14:16:17', '2026-01-28 21:35:11'),
(26, 'lbien Bilal', 'IT Team', 'bilal@usmba.ac.ma', '/uploads/1769636091441-84265602.jpeg', '2026-01-25 14:16:41', '2026-01-28 22:54:24'),
(27, 'Fahmi Ghita', 'Responsable Interne', 'fahmi.ghita@usmba.ac.ma', '/uploads/1769640314464-101149616.jpg', '2026-01-25 14:17:15', '2026-01-28 22:46:28');

-- --------------------------------------------------------

--
-- Structure de la table `clubs`
--

CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `club` varchar(255) NOT NULL,
  `president` varchar(255) NOT NULL,
  `annees_etude` varchar(100) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `website` varchar(500) DEFAULT '',
  `image` varchar(500) DEFAULT '',
  `observations` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `activities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`activities`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `members` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`members`)),
  `meetings` varchar(500) DEFAULT '',
  `socialMedia` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialMedia`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `clubs`
--

INSERT INTO `clubs` (`id`, `club`, `president`, `annees_etude`, `tel`, `email`, `website`, `image`, `observations`, `description`, `activities`, `achievements`, `members`, `meetings`, `socialMedia`, `createdAt`, `updatedAt`) VALUES
(2, 'The Great Debaters ENSA Fes', 'ALALOUCHE Walid', 'CI2', '0656790553', 'walidalalouche12@gmail.com', '', '/uploads/1769351018300-321784297.png', '', 'The Great Debaters ENSAF est un club académique fondé en 2018, dédié à la promotion de l\'art oratoire et du débat sous toutes ses formes. Chaque année, le club recrute jusqu\'à une centaine de membres et propose trois sections – français, anglais et arabe – permettant à chacun de s\'exprimer dans la langue qui lui convient le mieux.\\n\\nL\'objectif du club est double : développer les compétences en communication, esprit critique et leadership de ses membres à travers la formation et la pratique régulière, tout en valorisant l\'aspect compétitif du débat en participant aux tournois nationaux. Grâce à cette approche, le club a remporté de nombreux trophées et s\'est imposé comme un acteur majeur de la scène du débat au Maroc.\\n\\nEn plus de sa participation aux compétitions, The Great Debaters ENSAF organise deux événements phares : l\'All-Star Debate, qui réunit les meilleurs débatteurs de la communauté nationale, et LeLaplacien, une compétition destinée à mettre en lumière les jeunes talents rookies de la scène fassie.\\n\\nAlliant rigueur académique, esprit de compétition et convivialité, le club offre à ses membres un espace unique pour apprendre, s\'exprimer et grandir.', '[]', '[]', '[]', '', '{\"contact\":\"thegreatdebaters.ensaf@gmail.com\",\"facebook\":\"https://www.facebook.com/THEGREATDEBATERSENSAF\",\"linkedin\":\"https://www.linkedin.com/company/the-great-debaters-ensa-fez/\",\"instagram\":\"https://www.instagram.com/tgd_ensaf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==\"}', '2026-01-10 22:08:06', '2026-01-25 14:23:38'),
(3, 'Hult Prize ENSAF', 'Boustiti Amine', 'CI2', '0640540978', 'amine.boustiti@usmba.ac.ma', '', '/uploads/1769351302912-61560477.jpg', '', 'The Hult Prize is both a global movement and a university-based club with the mission to inspire and empower a new generation of entrepreneurial leaders to create sustainable and high-impact social enterprises that tackle the world’s most pressing social and global challenges, using the power of social entrepreneurship to drive positive change', '[]', '[]', '[]', '', '{\"contact\":\"hultprizeensaf28@gmail.com\",\"facebook\":\"https://www.facebook.com/people/Hult-Prize-Nationale-School-of-Applied-Sciences-of-Fez/61569442840472/?sk=about\",\"instagram\":\"https://www.instagram.com/hultp_rize_ensa.fez/\",\"linkedin\":\"https://www.linkedin.com/company/hultprizeensaf\"}', '2026-01-10 22:10:10', '2026-01-25 14:28:22'),
(4, 'HardSoft Developers ENSA FÈS', 'Imane Meslaha', 'CI2', '0679943998', 'amounaimana12@gmail.com', '', '/uploads/1769351558292-187418128.jpg', '', 'Le Club HardSoft est un espace d’apprentissage et d’innovation qui a pour principal objectif de former les élèves ingénieurs dans les domaines des systèmes embarqués et de l’intelligence artificielle. Convaincu que la maîtrise de ces technologies représente un atout majeur pour l’avenir, le club propose des formations techniques et des ateliers pratiques pour permettre aux étudiants de développer des compétences solides et applicables dans des projets concrets. En parallèle, HardSoft œuvre à rapprocher l’université du monde professionnel en organisant des événements, conférences et workshops en partenariat avec des entreprises du secteur. Le club accorde également une place importante à l’esprit de compétition et à l’échange entre écoles, en mettant en place des concours et challenges inter-écoles qui stimulent la créativité, l’innovation et le travail d’équipe. À travers ces missions, HardSoft ambitionne de créer une communauté d’étudiants passionnés, capables de relever les grands défis technologiques de demain et de s’imposer comme acteurs dans les domaines des systèmes embarqués et de l’IA.', '[]', '[]', '[]', '', '{\"contact\":\"https://www.instagram.com/hardsoft_ensaf\",\"instagram\":\"https://www.instagram.com/hardsoft_ensaf?igsh=M3hzdnppamNlYm9o\"}', '2026-01-10 22:10:28', '2026-01-25 14:32:38'),
(5, 'Mechatronics Trendz', 'Boustiti Amine', 'CI2', '0640540978', 'boustitiamine3@gmail.com', '', '/uploads/1769351445749-86874401.png', '', 'Le but du club est de promouvoir, dans l\'intérêt de ses membres, l’utilisation et le développement de leurs compétences en mécatronique en premier lieu. Cet objectif se situe dans le contexte de l\'amélioration des compétences des membres, notamment par la mise en œuvre des nouvelles technologies du domaine dans la réalisation de leurs projets.', '[]', '[]', '[]', '', '{\"contact\":\"https://www.linkedin.com/company/mechatronics-trendz\",\"linkedin\":\"https://www.linkedin.com/company/mechatronics-trendz-b69240203/\",\"facebook\":\"https://www.facebook.com/Mechatronicstrendz/\",\"instagram\":\"https://www.instagram.com/mechatronicstrendz/\"}', '2026-01-10 22:11:15', '2026-01-25 14:30:45'),
(6, 'ENACTUS ENSAF', 'Fechtali Reda', 'CI1', '0770096248', 'htazi435@gmail.com', '', '/uploads/1769351641302-17642765.jpg', '', 'C\'est un club au but de développement des compétences au domaine de l\'entrepreneuriat et en fin d\'année on a une compétition nationale des projets qui sont en relation avec les ODD pour le Bénéfice public', '[]', '[]', '[]', '', '{\"contact\":\"https://www.instagram.com/e.n.a.c.t.u.s_ensaf\",\"instagram\":\"https://www.instagram.com/e.n.a.c.t.u.s_ensaf?igsh=NDhmNDZvaHplZm84\"}', '2026-01-10 22:11:31', '2026-01-25 14:34:01'),
(17, 'SPACE Club ENSAF', 'ADNANE REDA', 'CI1', '0697286339', 'redaadnane142@gmail.com', '', '/uploads/1769351806103-645864911.jpg', '', ' SPACE Club ENSAF (Space Programs & Astronomy Club of Engineers) est un club scientifique et technique fondé par des étudiants de l’École Nationale des Sciences Appliquées de Fès.\r\n\r\nSa mission est de promouvoir la culture scientifique et technologique auprès des étudiants, à travers des activités liées à l’astronomie, l’ingénierie, l’innovation et l’exploration spatiale.\r\n\r\nLe club organise régulièrement des ateliers pratiques, des formations, des compétitions, ainsi que des événements de vulgarisation scientifique tels que des conférences et des soirées d’observation astronomique.\r\n\r\nLe SPACE Club ENSAF se veut aussi un espace de collaboration et de créativité, où les étudiants développent leurs compétences en ingénierie et en innovation, tout en renforçant leur esprit d’équipe et leur curiosité scientifique.', '[]', '[]', '[]', '', '{\"facebook\":\"https://www.facebook.com/share/16Y8KnHJEe/\",\"instagram\":\"https://www.instagram.com/space_ensaf?igsh=MTJlcjRhZ2poaGNiMw==\",\"linkedin\":\"https://www.linkedin.com/company/space-club-ensaf/\"}', '2026-01-25 14:36:46', '2026-01-26 20:29:36'),
(18, 'TEATRO DEL ALMA', 'Ayman Lebbar', 'CI2', '0704890686', 'ayman.lebbar@usmba.ac.ma', '', '/uploads/1769352084572-676189786.jpg', '', 'Teatro del Alma est un club universitaire artistique et culturel qui réunit des étudiants passionnés par le théâtre, la musique et l’ingénierie créative. Sa mission est de promouvoir l’expression scénique et technique au sein du campus, de donner une voix aux talents étudiants et de créer un espace d’échange entre art et innovation. Le club a pour objectif de développer la créativité, l’esprit d’équipe et la confiance en soi des membres à travers des ateliers, des projets techniques, des répétitions et des représentations. Parmi ses activités phares figurent l’organisation de pièces théâtrales, de spectacles musicaux, ainsi que la mise en œuvre de projets d’ingénierie liés à la scène et à la production artistique. Au-delà de ses performances, Teatro del Alma s’engage à valoriser la culture marocaine tout en intégrant les apports des nouvelles technologies et de l’ingénierie pour enrichir l’expérience artistique. Son ambition est de faire de l’art et de la technique un vecteur d’unité, d’inspiration et de rayonnement, tout en offrant aux étudiants une expérience humaine, créative et innovante.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/teatro_del_alma_ensaf?igsh=NmM0d2ZldHhyYjlu\",\"linkedin\":\"\"}', '2026-01-25 14:41:24', '2026-01-25 14:41:24'),
(19, 'Industrial Engineering Circle 4.0', 'Maha El-ghzizal ', 'CI2', '+212 631207295', 'mahaelghzizal@gmail.com', '', '/uploads/1769352206851-386327674.jpg', '', 'Le club IEC4.0 est un espace d’apprentissage, d’échange et d’innovation dédié aux étudiants passionnés par l’industrie 4.0 et ses applications. Notre objectif principal est de compléter la formation académique en offrant aux membres l’opportunité de découvrir des outils et pratiques rarement abordés en cours à l’ENSA. À travers des formations spécialisées, des ateliers pratiques et des tables rondes animées par des ingénieurs et experts du domaine, nous favorisons le partage d’expérience et le développement de compétences concrètes.\r\n\r\nChaque année, les membres du club travaillent sur un projet collectif, conçu comme un laboratoire d’application des connaissances acquises, renforçant ainsi l’esprit d’équipe et l’innovation. Notre événement phare, CAMPUS, constitue un moment fort de l’année : il rassemble étudiants et professionnels autour de conférences, workshops et échanges, offrant une occasion unique de valoriser le travail du club et de renforcer les liens avec le monde industriel.\r\n\r\nAinsi, IEC4.0 se veut un catalyseur d’idées et de savoirs, préparant ses membres aux défis de l’ingénierie moderne tout en cultivant une culture de collaboration et de curiosité scientifique.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/iec4.0_ensaf?igsh=bTdhMjVpYjlnYTBz\",\"linkedin\":\"https://www.linkedin.com/company/iecclub/\"}', '2026-01-25 14:43:26', '2026-01-25 14:43:26'),
(20, 'Forum Entreprises ENSAF', 'FATIMA ZAHRAE RMILI', 'CI1', '0635642698', 'fatimzzahrarmili@gmail.com', '', '/uploads/1769352362086-776112084.png', '', 'Le Club Forum Entreprises ENSAF a pour vocation de rapprocher les étudiants du monde professionnel. Il organise chaque année le Forum Entreprises, événement phare qui réunit élèves ingénieurs, entreprises et acteurs socio-économiques. Ses missions incluent aussi des conférences, ateliers de formation, visites industrielles et séances de coaching afin de préparer les étudiants aux défis du marché du travail. À travers ses activités, le club renforce l’employabilité des jeunes ingénieurs et valorise l’image de l’école auprès des partenaires extérieurs.', '[]', '[]', '[]', '', '{\"facebook\":\"https://www.facebook.com/profile.php?id=61559840151875\",\"instagram\":\"https://www.instagram.com/forumensafentreprises?igsh=cjRyaWl1Zzd3Zmx6\",\"linkedin\":\"https://www.linkedin.com/in/forum-entreprises-ensaf-7a50bb30a\"}', '2026-01-25 14:46:02', '2026-01-25 14:46:02'),
(21, 'POWER UP', 'NOUARY Lhoussaine ', 'CI2', '0624809871', 'nouary.houssaine@gmail.com', '', '/uploads/1769352438769-382455203.png', '', 'Nous sommes un club pour les élèves ingénieurs qui aimons apprendre et partager nos connaissances. Nous organisons des événements, des formations et des activités pour aider nos membres à développer leurs compétences et à se préparer pour leur future carrière. Notre objectif est de créer des environnements amicaux et stimulant où les membres peuvent grandir et réussir.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"\",\"linkedin\":\"\"}', '2026-01-25 14:47:18', '2026-01-25 14:47:18'),
(22, 'Bureau des sports', 'EL BAOUCHI ANAS ', 'CI2', '0602584690', 'anas.elbaouchi@gmail.com', '', '/uploads/1769352568065-583735609.jpg', '', 'Le Bureau des Sports est l’association étudiante qui anime et développe la vie sportive au sein de l’ENSAF. Sa mission est de promouvoir l’activité physique, la compétition saine et l’esprit d’équipe, tout en renforçant les liens entre étudiants à travers des événements fédérateurs.\r\n\r\nLe BDS organise chaque année un Main Event de la journée sportive, réunissant des tournois dans différentes disciplines, aussi bien collectives qu’individuelles, avec une attention particulière portée à la valorisation des sports féminins.\r\n\r\nEn parallèle, le BDS développe des activités innovantes telles que des tournois e-gaming en partenariat avec des acteurs du domaine, favorisant ainsi la rencontre entre sport traditionnel et sport digital.\r\n\r\nAfin d’élargir les horizons des étudiants, le BDS propose également des conférences et workshops autour du développement, du game dev et de l’intelligence artificielle, animés par des experts. Ces moments permettent de lier sport, innovation et savoir.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/bdsensaf?igsh=MXUyNDMyMGZpa3B6YQ==\",\"linkedin\":\"\"}', '2026-01-25 14:49:28', '2026-01-25 14:49:28'),
(23, 'Artistic universe', 'sara mountasser', 'CI1', ' +212 627-127522', 'Sara.mountasser@usmba.ac.ma', '', '/uploads/1769352643850-645368853.jpeg', '', 'Artistic Universe est un club créatif qui rassemble les passionnés d’art et de travaux manuels, désireux d’exprimer leur imagination et de partager leur talent. Notre objectif principal est de promouvoir la créativité sous toutes ses formes et d’offrir un espace où chacun peut développer ses compétences artistiques.\r\nNos missions consistent à encourager l’expression personnelle à travers différentes activités artistiques, à valoriser l’art comme moyen de communication et de bien-être, et à créer une communauté soudée autour de la passion commune pour l’art.\r\nLes activités du club incluent le dessin, la peinture, le handcraft (travaux manuels, artisanat, bricolage créatif), ainsi que des ateliers thématiques pour explorer diverses techniques artistiques. Nous organisons également des expositions, des concours et des projets collaboratifs afin de mettre en valeur les talents de nos membres et de stimuler leur esprit d’innovation.\r\nArtistic Universe se veut un univers ouvert à tous, où l’art devient un langage universel qui unit, inspire et donne vie à l’imagination.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/artistic_universe_ensaf?igsh=MWkwdXo2anFxbm8xNw==\",\"linkedin\":\"\"}', '2026-01-25 14:50:43', '2026-01-25 14:50:43'),
(24, 'Secops', 'MARIAM DAOUDI', 'CI2', '+212609651811', 'mariam.daoudi@usmba.ac.ma', '', '/uploads/1769352745184-962889168.png', '', 'SECOPS est un club de Cybersécurité, il a pour objectif de supporter les futurs ingénieurs et les former en réseaux/systèmes, ainsi des concepts de cybersécurité (cryptographie, web exploitation, forensics...), en organisant des compétitions CTF chaque semestre.\r\n', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"\",\"linkedin\":\"\"}', '2026-01-25 14:52:25', '2026-01-25 14:52:25'),
(25, 'IEEE Student Branch', 'MARIAM DAOUDI', 'CI2', '+212609651811', 'mariam.daoudi@usmba.ac.ma', '', '/uploads/1769355471667-523550729.jpeg', '', 'Le IEEE ENSAF Student Branch est un club académique et technique affilié à l’Institute of Electrical and Electronics Engineers (IEEE), la plus grande organisation professionnelle au monde dédiée à l’avancement de la technologie.\r\n\r\nNotre mission est de promouvoir l’innovation, le leadership et la collaboration entre les étudiants ingénieurs à travers des activités techniques, des compétitions, des conférences et des projets concrets.\r\n\r\nNous organisons chaque année des événements majeurs tels que l’IEEE Day, IEEEXtreme, des workshops en cybersécurité, Cloud, IA, ainsi que des initiatives d’entrepreneuriat et de développement personnel.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"\",\"linkedin\":\"\"}', '2026-01-25 15:37:51', '2026-01-25 15:37:51'),
(26, 'Association des Étudiants Étrangers ', 'Lawrence Chama', 'CI2', '+212624210445', 'lawrencechama44@gmail.com', '', '/uploads/1769355621475-621109001.png', '', 'L’Association des Étudiants Étrangers de l’ENSAF est une structure estudiantine dédiée à l’accueil, l’intégration et l’épanouissement des étudiants internationaux au sein de l’école. Elle a pour objectif principal de favoriser la cohésion entre différentes nationalités et de promouvoir le dialogue interculturel, faisant de l’ENSAF un espace ouvert et inclusif. Ses missions s’articulent autour de l’accompagnement des étudiants étrangers dans leur parcours académique et social, la valorisation de la diversité culturelle et la contribution à la vie associative et institutionnelle de l’école. À travers ses activités, l’association organise des événements académiques, sportifs et culturels : conférences, débats, compétitions, tournois et journées culturelles. Elle initie également des projets de sensibilisation, de formation et de collaboration avec d’autres clubs et associations. Plus qu’un cadre d’échange, l’Association des Étudiants Étrangers – ENSAF se veut un pont entre les cultures, un moteur d’intégration et un acteur engagé dans le rayonnement international de l’école.', '[]', '[]', '[]', '', '{\"facebook\":\"https://www.facebook.com/profile.php?id=61561910760226\",\"instagram\":\"https://www.instagram.com/aee.ensaf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==\",\"linkedin\":\"https://www.linkedin.com/company/association-des-%C3%A9tudiants-%C3%A9trangers-ensaf/posts?lipi=urn%3Ali%3Apage%3Ad_flagship3_company_posts%3B0d8hE6MCS5eJ%2FUGCQyNJZQ%3D%3D\"}', '2026-01-25 15:40:21', '2026-01-25 15:40:21'),
(27, 'Data Nexus', 'Douae Chaibi', 'CI2', '0674795126', 'douae.chaibi@usmba.ac.ma', '', '/uploads/1769355706138-986110317.jpeg', '', 'Data Nexus – ENSA Fès est un club étudiant dédié à l’intelligence artificielle et à la science des données. Notre mission est de créer un espace où les passionnés de technologies peuvent apprendre, innover et collaborer.\r\n\r\nNos principaux objectifs sont :\r\n	•	Offrir des formations techniques sur Python, Machine Learning, Deep Learning et les outils récents de l’IA.\r\n	•	Encadrer et lancer des projets pratiques permettant aux étudiants de développer leurs compétences et de les appliquer à des problématiques réelles.\r\n	•	Donner aux étudiants l’opportunité de présenter leurs projets sous forme de mini-soutenances pour partager leurs acquis et inspirer leurs pairs.\r\n	•	Organiser des compétitions et challenges pour stimuler la créativité, l’innovation et l’esprit d’équipe.\r\n	•	Inviter des experts et professionnels du domaine afin de renforcer le lien entre le monde académique et le milieu professionnel.\r\n\r\nÀ travers ces initiatives, Data Nexus aspire à bâtir une communauté dynamique qui contribue à l’émergence d’une nouvelle génération d’ingénieurs et de chercheurs capables de relever les défis de l’IA et de la data.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/data_nexus_ensaf?igsh=MWM1dDlieDF2c2M2Yg%3D%3D&utm_source=qr\",\"linkedin\":\"\"}', '2026-01-25 15:41:46', '2026-01-25 15:41:46'),
(28, 'Rotaract ensa fes', 'Dhirech Yassir', 'CI2', '0638154677', 'yassir.dhirech@usmba.ac.ma', '', '/uploads/1769355832964-245469018.jpeg', '', 'Le Rotaract Club Ensa Fès, créé en 2013, fait partie de la grande famille du Rotary International. Sa mission est de servir autrui tout en offrant à ses membres l’opportunité de développer leurs compétences personnelles, professionnelles et de leadership.\r\n\r\nDepuis sa création, le club s’est distingué par son engagement envers la solidarité, la camaraderie et l’innovation sociale. Il a mené diverses actions dans des domaines tels que l’éducation, la santé, l’environnement et l’aide aux communautés dans le besoin, apportant un impact réel aux bénéficiaires tout en renforçant chez ses membres l’esprit de service et de citoyenneté.\r\n\r\nRejoindre le Rotaract Ensa Fès, c’est intégrer une équipe unie par des valeurs d’amitié, de respect et de partage, et vivre une expérience enrichissante marquée par la diversité et le travail collectif. Fidèle à son motto “Service Above Self”, le club poursuit son engagement pour bâtir un avenir meilleur.', '[]', '[]', '[]', '', '{\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/rotaract_ensa_fes?igsh=djhoNGNzc2F2M2Jv\",\"linkedin\":\"https://www.linkedin.com/in/rotaract-ensa-fes-002059374\"}', '2026-01-25 15:43:52', '2026-01-25 15:43:52');

-- --------------------------------------------------------

--
-- Structure de la table `cycles`
--

CREATE TABLE `cycles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Nom du cycle',
  `type` enum('preparatoire','ingenieur') NOT NULL COMMENT 'Type de cycle',
  `duration_years` int(11) NOT NULL COMMENT 'Durée du cycle en années',
  `responsable_pedagogique` varchar(255) DEFAULT NULL COMMENT 'Responsable pédagogique du cycle',
  `responsable_contact` varchar(255) DEFAULT NULL COMMENT 'Contact du responsable',
  `description` text DEFAULT NULL COMMENT 'Description du cycle',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Indique si le cycle est actif',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cycles`
--

INSERT INTO `cycles` (`id`, `name`, `type`, `duration_years`, `responsable_pedagogique`, `responsable_contact`, `description`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Cycle Préparatoire', 'preparatoire', 2, 'Prof. Responsable Cycle Préparatoire', 'resp.cp@ensa-fes.ac.ma', 'Cycle préparatoire intégré de 2 ans', 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(2, 'Cycle d\'Ingénieur', 'ingenieur', 3, 'Prof. Responsable Cycle Ingénieur', 'resp.ci@ensa-fes.ac.ma', 'Cycle d\'ingénieur de 3 ans avec spécialisation par filière', 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT '',
  `organizer` varchar(255) DEFAULT 'ADEI',
  `clubId` int(11) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `document` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `link` varchar(500) DEFAULT NULL COMMENT 'Lien externe vers plus d''informations'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `time`, `location`, `category`, `organizer`, `clubId`, `image`, `document`, `createdAt`, `updatedAt`, `link`) VALUES
(8, 'titre evenement', 'Description event', '2026-02-06', '14:00', 'Lieu event', 'academic', 'ADEI', 18, '/uploads/1769474067076-153420205.jpg', '/uploads/1769474067086-794326054.jpg', '2026-01-27 00:34:27', '2026-01-27 00:48:43', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` enum('avis','recommandation','autre') NOT NULL,
  `message` text NOT NULL,
  `userId` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur (null pour feedbacks anonymes)',
  `read` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `name`, `email`, `type`, `message`, `userId`, `read`, `createdAt`, `updatedAt`) VALUES
(10, 'Yasser Dhirech', 'yasser.otaku999@gmail.com', 'avis', 'salut cava', NULL, 0, '2026-01-27 02:08:21', '2026-01-27 02:08:21'),
(11, 'Yasser Dhirech', 'yasser.otaku999@gmail.com', 'avis', 'salam', 4, 0, '2026-01-28 17:47:55', '2026-01-28 17:47:55');

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL COMMENT 'Nom complet de la filière',
  `abbreviation` varchar(20) NOT NULL COMMENT 'Abréviation de la filière (ex: GTR, GI, GC)',
  `type` enum('filiere','prepa') NOT NULL DEFAULT 'filiere' COMMENT 'Type: filiere pour cycle ingénieur, prepa pour cycle préparatoire',
  `cycle_id` int(11) DEFAULT NULL COMMENT 'ID du cycle parent',
  `years` longtext DEFAULT NULL COMMENT 'Données JSON des années (legacy)',
  `documentation` varchar(1000) DEFAULT NULL COMMENT 'Lien vers la documentation officielle',
  `drive` varchar(1000) DEFAULT NULL COMMENT 'Lien vers le drive de la filière',
  `responsable` varchar(255) DEFAULT 'À définir' COMMENT 'Responsable (legacy)',
  `RespoContact` varchar(255) DEFAULT NULL COMMENT 'Contact du responsable',
  `description` text DEFAULT NULL COMMENT 'Description détaillée de la filière',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Indique si la filière est active',
  `order_display` int(11) DEFAULT 0 COMMENT 'Ordre d''affichage',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `responsablePedagogique` varchar(255) DEFAULT NULL COMMENT 'Responsable pédagogique de la filière',
  `delegueA1` varchar(255) DEFAULT NULL COMMENT 'Délégué section A année 1',
  `telDelegueA1` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section A année 1',
  `delegueB1` varchar(255) DEFAULT NULL COMMENT 'Délégué section B année 1',
  `telDelegueB1` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section B année 1',
  `delegueC1` varchar(255) DEFAULT NULL COMMENT 'Délégué section C année 1',
  `telDelegueC1` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section C année 1',
  `delegueA2` varchar(255) DEFAULT NULL COMMENT 'Délégué section A année 2',
  `telDelegueA2` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section A année 2',
  `delegueB2` varchar(255) DEFAULT NULL COMMENT 'Délégué section B année 2',
  `telDelegueB2` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section B année 2',
  `delegueC2` varchar(255) DEFAULT NULL COMMENT 'Délégué section C année 2',
  `telDelegueC2` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué section C année 2',
  `delegueFiliere` varchar(255) DEFAULT NULL COMMENT 'Délégué général de la filière',
  `telDelegueFiliere` varchar(20) DEFAULT NULL COMMENT 'Téléphone délégué général de la filière'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `name`, `abbreviation`, `type`, `cycle_id`, `years`, `documentation`, `drive`, `responsable`, `RespoContact`, `description`, `isActive`, `order_display`, `createdAt`, `updatedAt`, `responsablePedagogique`, `delegueA1`, `telDelegueA1`, `delegueB1`, `telDelegueB1`, `delegueC1`, `telDelegueC1`, `delegueA2`, `telDelegueA2`, `delegueB2`, `telDelegueB2`, `delegueC2`, `telDelegueC2`, `delegueFiliere`, `telDelegueFiliere`) VALUES
(1, 'Cycle Préparatoire', 'CP', 'prepa', 1, NULL, NULL, NULL, 'À définir', NULL, 'Cycle préparatoire intégré avec sections A, B, C pour CP1 et CP2', 1, 1, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Génie des Télécommunications et Réseaux', 'GTR', 'filiere', 2, NULL, 'https://docs.ensa-fes.ac.ma/gtr', 'https://drive.google.com/drive/folders/GTR', 'À définir', NULL, 'Filière spécialisée en télécommunications et réseaux', 1, 2, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Génie Informatique', 'GI', 'filiere', 2, NULL, 'https://docs.ensa-fes.ac.ma/gi', 'https://drive.google.com/drive/folders/GI', 'À définir', NULL, 'Filière spécialisée en informatique et développement', 1, 3, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Génie Civil', 'GC', 'filiere', 2, NULL, 'https://docs.ensa-fes.ac.ma/gc', 'https://drive.google.com/drive/folders/GC', 'À définir', NULL, 'Filière spécialisée en génie civil et construction', 1, 4, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Génie Électrique', 'GE', 'filiere', 2, NULL, 'https://docs.ensa-fes.ac.ma/ge', 'https://drive.google.com/drive/folders/GE', 'À définir', NULL, 'Filière spécialisée en génie électrique et électronique', 1, 5, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Génie Mécanique', 'GM', 'filiere', 2, NULL, 'https://docs.ensa-fes.ac.ma/gm', 'https://drive.google.com/drive/folders/GM', 'À définir', NULL, 'Filière spécialisée en génie mécanique', 1, 6, '2026-01-27 23:33:34', '2026-01-27 23:33:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL,
  `organizer` varchar(255) DEFAULT 'ADEI',
  `clubId` int(11) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `document` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `link` varchar(500) DEFAULT NULL COMMENT 'Lien externe vers plus d''informations'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `date`, `organizer`, `clubId`, `image`, `document`, `createdAt`, `updatedAt`, `link`) VALUES
(6, 'Titre actualite', 'contenu actualite', '2026-01-29', 'ADEI', 4, '/uploads/1769473862347-867180191.jpg', '/uploads/1769473862365-60757159.jpg', '2026-01-27 00:31:02', '2026-01-27 00:47:54', NULL),
(7, 'titre act', 'contenu', '2026-01-08', 'ADEI', 20, NULL, NULL, '2026-01-27 00:56:22', '2026-01-27 00:56:22', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `partners`
--

CREATE TABLE `partners` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `logo` varchar(500) DEFAULT '/images/default.jpg',
  `isActive` tinyint(1) DEFAULT 1,
  `order_display` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `facebook` varchar(500) DEFAULT NULL,
  `instagram` varchar(500) DEFAULT NULL,
  `whatsapp` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `partners`
--

INSERT INTO `partners` (`id`, `name`, `description`, `website`, `logo`, `isActive`, `order_display`, `createdAt`, `updatedAt`, `facebook`, `instagram`, `whatsapp`) VALUES
(2, 'Rahma Soft', 'vendeur des PCs ', NULL, '/uploads/1769461885233-752390944.png', 1, 0, '2026-01-26 21:11:25', '2026-01-26 21:11:25', NULL, NULL, NULL),
(3, 'TrustNetwork', 'Services Digitales : ChatGPT+', NULL, '/uploads/1769472777112-186130428.jpeg', 1, 0, '2026-01-27 00:12:57', '2026-01-27 00:12:57', 'https://web.facebook.com/profile.php?id=100088503556805&locale=fr_FR', 'https://www.instagram.com/trust__network/', 'https://wa.me/212620888143');

-- --------------------------------------------------------

--
-- Structure de la table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL COMMENT 'Nom de la section (A, B, C)',
  `academic_year_id` int(11) NOT NULL COMMENT 'ID de l''année académique parent',
  `delegate_name` varchar(255) DEFAULT NULL COMMENT 'Nom du délégué étudiant de la section',
  `delegate_phone` varchar(20) DEFAULT NULL COMMENT 'Téléphone du délégué étudiant',
  `delegate_email` varchar(255) DEFAULT NULL COMMENT 'Email du délégué étudiant',
  `student_count` int(11) DEFAULT 0 COMMENT 'Nombre d''étudiants dans la section',
  `classroom` varchar(100) DEFAULT NULL COMMENT 'Salle de classe principale',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Indique si la section est active',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sections`
--

INSERT INTO `sections` (`id`, `name`, `academic_year_id`, `delegate_name`, `delegate_phone`, `delegate_email`, `student_count`, `classroom`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'A', 1, 'Nom Délégué CP1-A', '0600000001', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(2, 'B', 1, 'Nom Délégué CP1-B', '0600000002', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(3, 'C', 1, 'Nom Délégué CP1-C', '0600000003', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(4, 'A', 2, 'Nom Délégué CP2-A', '0600000004', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(5, 'B', 2, 'Nom Délégué CP2-B', '0600000005', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34'),
(6, 'C', 2, 'Nom Délégué CP2-C', '0600000006', NULL, 0, NULL, 1, '2026-01-28 00:33:34', '2026-01-28 00:33:34');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_president` tinyint(1) DEFAULT 0,
  `is_representant` tinyint(1) DEFAULT 0,
  `is_membre_adei` tinyint(1) DEFAULT 0,
  `is_bureau_adei` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `is_president`, `is_representant`, `is_membre_adei`, `is_bureau_adei`) VALUES
(2, 'Moslim Ar', 'moslimarabi86@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '2026-01-04 18:56:38', '2026-01-26 22:51:54', 1, 1, 1, 1),
(4, 'Yasser Dhirech', 'yasser.otaku999@gmail.com', '$2b$10$YYcx32rFAK1zDquBwNr.OucKtzik5pNqVsPMk40Hm5QS0/mt.ahw6', 'admin', '2026-01-16 20:37:58', '2026-01-27 02:10:28', 1, 0, 0, 1),
(8, 'Iman', 'iman@gmail.com', '$2b$10$OSfFsqpOsq1SZfbB/0..2upjDBmQyAw.C72unfm1teCksoF9nrQAq', 'user', '2026-01-26 17:11:42', '2026-01-26 17:19:25', 0, 0, 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_academic_years_cycle_id` (`cycle_id`),
  ADD KEY `idx_academic_years_filiere_id` (`filiere_id`),
  ADD KEY `idx_academic_years_year_number` (`year_number`),
  ADD KEY `idx_academic_years_isActive` (`isActive`),
  ADD KEY `idx_academic_years_order_display` (`order_display`),
  ADD KEY `academic_years_cycle_id` (`cycle_id`),
  ADD KEY `academic_years_filiere_id` (`filiere_id`),
  ADD KEY `academic_years_year_number` (`year_number`),
  ADD KEY `academic_years_is_active` (`isActive`),
  ADD KEY `academic_years_order_display` (`order_display`);

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
-- Index pour la table `cycles`
--
ALTER TABLE `cycles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cycles_type` (`type`),
  ADD KEY `idx_cycles_isActive` (`isActive`),
  ADD KEY `cycles_type` (`type`),
  ADD KEY `cycles_is_active` (`isActive`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedbacks_userId` (`userId`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `abbreviation` (`abbreviation`),
  ADD KEY `idx_filieres_type` (`type`),
  ADD KEY `idx_filieres_cycle_id` (`cycle_id`),
  ADD KEY `idx_filieres_isActive` (`isActive`),
  ADD KEY `idx_filieres_order_display` (`order_display`),
  ADD KEY `filieres_abbreviation` (`abbreviation`),
  ADD KEY `filieres_type` (`type`),
  ADD KEY `filieres_cycle_id` (`cycle_id`),
  ADD KEY `filieres_is_active` (`isActive`),
  ADD KEY `filieres_order_display` (`order_display`);

--
-- Index pour la table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sections_academic_year_id` (`academic_year_id`),
  ADD KEY `idx_sections_name` (`name`),
  ADD KEY `idx_sections_isActive` (`isActive`),
  ADD KEY `sections_academic_year_id` (`academic_year_id`),
  ADD KEY `sections_name` (`name`),
  ADD KEY `sections_is_active` (`isActive`);

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
-- AUTO_INCREMENT pour la table `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `adei_members`
--
ALTER TABLE `adei_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `cycles`
--
ALTER TABLE `cycles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `academic_years`
--
ALTER TABLE `academic_years`
  ADD CONSTRAINT `fk_academic_years_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `cycles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_academic_years_filiere` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `fk_feedbacks_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD CONSTRAINT `fk_filieres_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `cycles` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `fk_sections_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
