-- MySQL dump 10.13  Distrib 5.5.40, for Win64 (x86)
--
-- Host: localhost    Database: softbei
-- ------------------------------------------------------
-- Server version	5.5.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_airport`
--

DROP TABLE IF EXISTS `t_airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_airport` (
  `airport_id` varchar(10) NOT NULL DEFAULT '',
  `from_city` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`airport_id`),
  KEY `FK_from_city` (`from_city`),
  CONSTRAINT `FK_from_city` FOREIGN KEY (`from_city`) REFERENCES `t_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_airport`
--

LOCK TABLES `t_airport` WRITE;
/*!40000 ALTER TABLE `t_airport` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_city`
--

DROP TABLE IF EXISTS `t_city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_city` (
  `city_id` varchar(10) NOT NULL,
  `city_cordinate` varchar(50) DEFAULT NULL,
  `from_province` varchar(50) DEFAULT NULL,
  `from_region` varchar(50) DEFAULT NULL,
  `from_country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_city`
--

LOCK TABLES `t_city` WRITE;
/*!40000 ALTER TABLE `t_city` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_flight`
--

DROP TABLE IF EXISTS `t_flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_flight` (
  `flight_id` varchar(10) NOT NULL DEFAULT '',
  `airways` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `qf_airport` varchar(10) DEFAULT NULL,
  `qf_position` varchar(20) DEFAULT NULL,
  `mb_airport` varchar(20) DEFAULT NULL,
  `jl_position` varchar(20) DEFAULT NULL,
  `plan_qf_time` datetime DEFAULT NULL,
  `plan_dd_time` datetime DEFAULT NULL,
  `cctual_qf_time` datetime DEFAULT NULL,
  `cctual_dd_time` datetime DEFAULT NULL,
  `state` varchar(5) DEFAULT NULL,
  `qf_yw_length` varchar(20) DEFAULT NULL,
  `dd_yw_length` varchar(20) DEFAULT NULL,
  `qf_hx_length` varchar(20) DEFAULT NULL,
  `jl_hx_length` varchar(20) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `speed` varchar(10) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `distance` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `FK_qf_airport` (`qf_airport`),
  KEY `FK_mb_airport` (`mb_airport`),
  CONSTRAINT `FK_qf_airport` FOREIGN KEY (`qf_airport`) REFERENCES `t_airport` (`airport_id`),
  CONSTRAINT `FK_mb_airport` FOREIGN KEY (`mb_airport`) REFERENCES `t_airport` (`airport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_flight`
--

LOCK TABLES `t_flight` WRITE;
/*!40000 ALTER TABLE `t_flight` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_stop_over`
--

DROP TABLE IF EXISTS `t_stop_over`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_stop_over` (
  `flight_id` varchar(10) NOT NULL DEFAULT '',
  `airport_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `FK_airport_id` (`airport_id`),
  CONSTRAINT `FK_airport_id` FOREIGN KEY (`airport_id`) REFERENCES `t_airport` (`airport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_stop_over`
--

LOCK TABLES `t_stop_over` WRITE;
/*!40000 ALTER TABLE `t_stop_over` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_stop_over` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_yw_lenght`
--

DROP TABLE IF EXISTS `t_yw_lenght`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_yw_lenght` (
  `id` int(11) NOT NULL DEFAULT '0',
  `qf_airport` varchar(10) DEFAULT NULL,
  `dd_airport` varchar(10) DEFAULT NULL,
  `qf_yw_lenght` varchar(10) DEFAULT NULL,
  `jl_wd_lenght` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_qf_yw` (`qf_airport`),
  KEY `FK_dd_yw` (`dd_airport`),
  CONSTRAINT `FK_qf_yw` FOREIGN KEY (`qf_airport`) REFERENCES `t_airport` (`airport_id`),
  CONSTRAINT `FK_dd_yw` FOREIGN KEY (`dd_airport`) REFERENCES `t_airport` (`airport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_yw_lenght`
--

LOCK TABLES `t_yw_lenght` WRITE;
/*!40000 ALTER TABLE `t_yw_lenght` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_yw_lenght` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-16 18:48:45
