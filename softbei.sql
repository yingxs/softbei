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
  `airport_id` varchar(10) NOT NULL DEFAULT '' COMMENT '机场ID',
  `from_city` varchar(10) DEFAULT NULL COMMENT '机场所在城市',
  `airport_name` varchar(50) DEFAULT NULL COMMENT '机场中文名称',
  PRIMARY KEY (`airport_id`),
  KEY `FK_from_city` (`from_city`),
  CONSTRAINT `FK_from_city` FOREIGN KEY (`from_city`) REFERENCES `t_city` (`city_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_airport`
--

LOCK TABLES `t_airport` WRITE;
/*!40000 ALTER TABLE `t_airport` DISABLE KEYS */;
INSERT INTO `t_airport` VALUES ('KJFK/JFK','000002','肯迪尼国际机场'),('PEK/ZBAA','000001','北京首都国际机场');
/*!40000 ALTER TABLE `t_airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_city`
--

DROP TABLE IF EXISTS `t_city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_city` (
  `city_id` varchar(10) NOT NULL COMMENT '城市ID',
  `city_name_zh` varchar(50) DEFAULT NULL COMMENT '城市中文名',
  `city_name_en` varchar(50) DEFAULT NULL COMMENT '城市英文名',
  `city_cordinate` varchar(50) DEFAULT NULL COMMENT '城市经纬坐标',
  `from_province` varchar(50) DEFAULT NULL COMMENT '城市所在省',
  `from_region` varchar(50) DEFAULT NULL COMMENT '城市所在地区',
  `from_country` varchar(50) DEFAULT NULL COMMENT '城市所在国家',
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_city`
--

LOCK TABLES `t_city` WRITE;
/*!40000 ALTER TABLE `t_city` DISABLE KEYS */;
INSERT INTO `t_city` VALUES ('000001','北京','Beijing','116.407526,39.90403','-','华北','中国'),('000002','纽约','City of New York/New York/NYC','-','纽约州','-','美国');
/*!40000 ALTER TABLE `t_city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_flight`
--

DROP TABLE IF EXISTS `t_flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_flight` (
  `filght_id` varchar(20) NOT NULL COMMENT '航班号',
  PRIMARY KEY (`filght_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_flight`
--

LOCK TABLES `t_flight` WRITE;
/*!40000 ALTER TABLE `t_flight` DISABLE KEYS */;
INSERT INTO `t_flight` VALUES ('CCA981/CA981');
/*!40000 ALTER TABLE `t_flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_flight_info`
--

DROP TABLE IF EXISTS `t_flight_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_flight_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `flight_id` varchar(20) NOT NULL COMMENT '航班号',
  `airways` varchar(20) DEFAULT NULL COMMENT '航空公司',
  `date` date DEFAULT NULL COMMENT '日期',
  `qf_airport` varchar(10) DEFAULT NULL COMMENT '起飞机场',
  `qf_position` varchar(20) DEFAULT NULL COMMENT '起飞位置',
  `mb_airport` varchar(20) DEFAULT NULL COMMENT '目标机场',
  `jl_position` varchar(20) DEFAULT NULL COMMENT '降落位置',
  `plan_qf_time` varchar(50) DEFAULT NULL COMMENT '计划起飞时间',
  `plan_lk_time` varchar(50) DEFAULT NULL COMMENT '计划离开停机位时间',
  `plan_jl_time` varchar(50) DEFAULT NULL COMMENT '计划降落时间',
  `plan_dd_time` varchar(50) DEFAULT NULL COMMENT '计划到达停机位时间',
  `cctual_qf_time` varchar(50) DEFAULT NULL COMMENT '实际起飞时间',
  `cctual_lk_time` varchar(50) DEFAULT NULL COMMENT '实际离开停机位时间',
  `cctual_jl_time` varchar(50) DEFAULT NULL COMMENT '实际降落时间',
  `cctual_dd_time` varchar(50) DEFAULT NULL COMMENT '实际到达停机位时间',
  `qf_state` varchar(20) DEFAULT NULL COMMENT '起飞时状态',
  `dd_state` varchar(5) DEFAULT NULL COMMENT '到达时状态',
  `qf_yw_length` varchar(20) DEFAULT NULL COMMENT '起飞提前或延误时长',
  `dd_yw_length` varchar(20) DEFAULT NULL COMMENT '到达提前或晚点时长',
  `qf_hx_length` varchar(20) DEFAULT NULL COMMENT '起飞滑行时长',
  `jl_hx_length` varchar(20) DEFAULT NULL COMMENT '降落滑行时长',
  `model` varchar(50) DEFAULT NULL COMMENT '机型',
  `speed` varchar(10) DEFAULT NULL COMMENT '飞行速度',
  `height` varchar(10) DEFAULT NULL COMMENT '飞行高度',
  `zx_distance` varchar(15) DEFAULT NULL COMMENT '直线距离',
  `jh_distance` varchar(15) DEFAULT NULL COMMENT '计划飞行距离',
  `sj_distance` varchar(15) DEFAULT NULL COMMENT '实际飞行距离',
  PRIMARY KEY (`id`),
  KEY `FK_mb_airport` (`mb_airport`),
  KEY `FK_qf_airport` (`qf_airport`),
  KEY `FK_flight_id` (`flight_id`),
  CONSTRAINT `FK_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `t_flight` (`filght_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_mb_airport` FOREIGN KEY (`mb_airport`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_qf_airport` FOREIGN KEY (`qf_airport`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_flight_info`
--

LOCK TABLES `t_flight_info` WRITE;
/*!40000 ALTER TABLE `t_flight_info` DISABLE KEYS */;
INSERT INTO `t_flight_info` VALUES (1,'CCA981/CA981','Air China','2018-05-03','PEK/ZBAA','E36停机位','KJFK/JFK','T1航站楼','2018-05-03 13:00 CST','2018-05-03 13:00 CST','2018-05-03 13:46 EDT','2018-05-03 14::20 EDT','2018-05-03 13:28 CST','2018-05-03 11:46 CST','2018-05-03 13:53 EDT','2018-05-03 14:03 EDT','提前','提前','-1h14min','-17min','1h42min','10min','	Boeing 747-8 (四发) (B748)','933km/h','8400m','10992km','12501km','11284km');
/*!40000 ALTER TABLE `t_flight_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_stop_over`
--

DROP TABLE IF EXISTS `t_stop_over`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_stop_over` (
  `flight_id` varchar(15) NOT NULL,
  `airport1` varchar(15) DEFAULT NULL,
  `airport2` varchar(15) DEFAULT NULL,
  `airport3` varchar(15) DEFAULT NULL,
  `airport4` varchar(15) DEFAULT NULL,
  `airport5` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `FK_airport1` (`airport1`),
  KEY `FK_airport2` (`airport2`),
  KEY `FK_airport3` (`airport3`),
  KEY `FK_airport4` (`airport4`),
  KEY `FK_airport5` (`airport5`),
  CONSTRAINT `FK_flight_id3` FOREIGN KEY (`flight_id`) REFERENCES `t_flight` (`filght_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_airport1` FOREIGN KEY (`airport1`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_airport2` FOREIGN KEY (`airport2`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_airport3` FOREIGN KEY (`airport3`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_airport4` FOREIGN KEY (`airport4`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_airport5` FOREIGN KEY (`airport5`) REFERENCES `t_airport` (`airport_id`) ON UPDATE CASCADE
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
  `flight_id` varchar(10) NOT NULL,
  `qf_yw_lenght` varchar(15) DEFAULT NULL,
  `dd_yw_lenght` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`flight_id`),
  CONSTRAINT `FK_flight_id2` FOREIGN KEY (`flight_id`) REFERENCES `t_flight` (`filght_id`) ON UPDATE CASCADE
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

-- Dump completed on 2018-05-17 16:39:22
