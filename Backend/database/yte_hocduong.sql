-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: yte_hocduong
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baiviet`
--

DROP TABLE IF EXISTS `baiviet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baiviet` (
  `MaBV` int NOT NULL AUTO_INCREMENT,
  `TieuDe` varchar(255) DEFAULT NULL,
  `NoiDung` text,
  `NgayDang` date DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaBV`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `baiviet_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baiviet`
--

LOCK TABLES `baiviet` WRITE;
/*!40000 ALTER TABLE `baiviet` DISABLE KEYS */;
INSERT INTO `baiviet` VALUES (1,'Phòng tránh cảm cúm mùa đông','Rửa tay thường xuyên, đeo khẩu trang khi ra ngoài...','2025-11-01',22),(2,'Tập thể dục mỗi ngày','Giúp học sinh tăng cường sức đề kháng và phát triển thể lực','2025-11-02',23),(3,'Phòng tránh cảm cúm mùa đông','Rửa tay thường xuyên, đeo khẩu trang khi ra ngoài...','2025-11-01',22),(4,'Tập thể dục mỗi ngày','Giúp học sinh tăng cường sức đề kháng và phát triển thể lực','2025-11-02',23);
/*!40000 ALTER TABLE `baiviet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bangiamhieu`
--

DROP TABLE IF EXISTS `bangiamhieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bangiamhieu` (
  `MaBGH` int NOT NULL AUTO_INCREMENT,
  `HoTen` varchar(100) DEFAULT NULL,
  `ChucVu` varchar(100) DEFAULT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaBGH`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `bangiamhieu_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bangiamhieu`
--

LOCK TABLES `bangiamhieu` WRITE;
/*!40000 ALTER TABLE `bangiamhieu` DISABLE KEYS */;
INSERT INTO `bangiamhieu` VALUES (1,'Phạm Thị Thanh','Hiệu trưởng','0905888999','thanh.pham@truong.edu.vn',26),(2,'Võ Văn Hùng','Phó hiệu trưởng','0905333666','hung.vo@truong.edu.vn',27);
/*!40000 ALTER TABLE `bangiamhieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canboyte`
--

DROP TABLE IF EXISTS `canboyte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canboyte` (
  `MaCBYT` int NOT NULL AUTO_INCREMENT,
  `HoTen` varchar(100) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` enum('Nam','Nu') DEFAULT NULL,
  `ChucVu` varchar(100) DEFAULT NULL,
  `TrinhDo` varchar(100) DEFAULT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaCBYT`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `canboyte_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canboyte`
--

LOCK TABLES `canboyte` WRITE;
/*!40000 ALTER TABLE `canboyte` DISABLE KEYS */;
INSERT INTO `canboyte` VALUES (1,'Lê Thị Mai','1988-03-22','Nu','Y sĩ học đường','Đại học Y Dược Huế','0905001122','mai.le@truong.edu.vn',21),(2,'Nguyễn Văn Lộc','1985-07-15','Nam','Điều dưỡng','Cao đẳng Y tế','0912333444','loc.nguyen@truong.edu.vn',22),(3,'Trần Thị Hạnh','1990-05-10','Nu','Y tá','Trung cấp Y tế','0905222333','hanh.tran@truong.edu.vn',23),(4,'Phạm Quốc Dũng','1983-02-11','Nam','Y sĩ phụ trách','Đại học Y Hà Nội','0912555666','dung.pham@truong.edu.vn',24),(5,'Ngô Thị Thủy','1987-09-29','Nu','Điều dưỡng trưởng','Đại học Y Dược Huế','0905666777','thuy.ngo@truong.edu.vn',25);
/*!40000 ALTER TABLE `canboyte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `duyetbai`
--

DROP TABLE IF EXISTS `duyetbai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duyetbai` (
  `MaDuyet` int NOT NULL AUTO_INCREMENT,
  `MaBV` int DEFAULT NULL,
  `MaBGH` int DEFAULT NULL,
  `TrangThai` enum('ChoDuyet','DaDuyet','TuChoi') DEFAULT NULL,
  `NgayDuyet` date DEFAULT NULL,
  PRIMARY KEY (`MaDuyet`),
  KEY `MaBV` (`MaBV`),
  KEY `MaBGH` (`MaBGH`),
  CONSTRAINT `duyetbai_ibfk_1` FOREIGN KEY (`MaBV`) REFERENCES `baiviet` (`MaBV`),
  CONSTRAINT `duyetbai_ibfk_2` FOREIGN KEY (`MaBGH`) REFERENCES `bangiamhieu` (`MaBGH`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duyetbai`
--

LOCK TABLES `duyetbai` WRITE;
/*!40000 ALTER TABLE `duyetbai` DISABLE KEYS */;
INSERT INTO `duyetbai` VALUES (3,1,1,'DaDuyet','2025-11-02'),(4,2,1,'ChoDuyet',NULL);
/*!40000 ALTER TABLE `duyetbai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hocsinh`
--

DROP TABLE IF EXISTS `hocsinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hocsinh` (
  `MaHS` int NOT NULL AUTO_INCREMENT,
  `HoTen` varchar(100) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` enum('Nam','Nu') DEFAULT NULL,
  `Lop` varchar(50) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `SoDienThoaiPH` varchar(15) DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaHS`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hocsinh`
--

LOCK TABLES `hocsinh` WRITE;
/*!40000 ALTER TABLE `hocsinh` DISABLE KEYS */;
INSERT INTO `hocsinh` VALUES (21,'Nguyễn Văn An','2010-05-12','Nam','6A1','Phú Gia','0901111001',1),(22,'Trần Thị Hoa','2011-02-18','Nu','6A2','Phú Gia','0901111002',2),(23,'Lê Văn Minh','2010-09-10','Nam','7B1','Thủy Xuân','0901111003',3),(24,'Phạm Ngọc Hà','2011-01-14','Nu','6A1','Phú Gia','0901111004',4),(25,'Đoàn Hữu Đức','2010-12-07','Nam','7C2','Phú Thượng','0901111005',5),(26,'Ngô Mai Phương','2011-04-20','Nu','6A2','Thủy Xuân','0901111006',6),(27,'Võ Hoàng Nam','2010-07-30','Nam','7B2','Phú Gia','0901111007',7),(28,'Trần Minh Quân','2011-05-18','Nam','6A3','An Cựu','0901111008',8),(29,'Nguyễn Hồng Ngọc','2010-06-25','Nu','7B3','Phú Gia','0901111009',9),(30,'Đinh Gia Bảo','2010-10-02','Nam','7C1','Phú Vang','0901111010',10),(31,'Bùi Huy Hoàng','2010-11-12','Nam','6A1','Phú Gia','0901111011',11),(32,'Phan Thị Thảo','2011-03-09','Nu','7B1','Thủy Xuân','0901111012',12),(33,'Nguyễn Nhật Long','2010-08-23','Nam','7C2','An Cựu','0901111013',13),(34,'Tạ Gia Linh','2011-05-15','Nu','6A2','Phú Gia','0901111014',14),(35,'Phan Văn Tài','2010-09-14','Nam','7B3','Thủy Xuân','0901111015',15),(36,'Huỳnh Mỹ Duyên','2011-01-02','Nu','6A1','Phú Gia','0901111016',16),(37,'Lương Gia Hân','2010-12-19','Nu','7C1','Phú Vang','0901111017',17),(38,'Trần Tuấn Kiệt','2010-03-29','Nam','7B2','An Cựu','0901111018',18),(39,'Đỗ Thanh Vân','2011-02-22','Nu','6A3','Thủy Xuân','0901111019',19),(40,'Nguyễn Văn Tín','2010-08-05','Nam','7B1','Phú Gia','0901111020',20);
/*!40000 ALTER TABLE `hocsinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich90ngay`
--

DROP TABLE IF EXISTS `lich90ngay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich90ngay` (
  `MaLich90` int NOT NULL AUTO_INCREMENT,
  `NgayDuKien` date DEFAULT NULL,
  `NoiDung` varchar(255) DEFAULT NULL,
  `MaHS` int DEFAULT NULL,
  PRIMARY KEY (`MaLich90`),
  KEY `MaHS` (`MaHS`),
  CONSTRAINT `lich90ngay_ibfk_1` FOREIGN KEY (`MaHS`) REFERENCES `hocsinh` (`MaHS`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich90ngay`
--

LOCK TABLES `lich90ngay` WRITE;
/*!40000 ALTER TABLE `lich90ngay` DISABLE KEYS */;
INSERT INTO `lich90ngay` VALUES (1,'2026-02-01','Tái khám sức khỏe định kỳ',23),(2,'2026-02-01','Kiểm tra thị lực',24);
/*!40000 ALTER TABLE `lich90ngay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichkham`
--

DROP TABLE IF EXISTS `lichkham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichkham` (
  `MaLichKham` int NOT NULL AUTO_INCREMENT,
  `NgayKham` date DEFAULT NULL,
  `DiaDiem` varchar(100) DEFAULT NULL,
  `MaCBYT` int DEFAULT NULL,
  `MaHS` int DEFAULT NULL,
  PRIMARY KEY (`MaLichKham`),
  KEY `MaCBYT` (`MaCBYT`),
  KEY `MaHS` (`MaHS`),
  CONSTRAINT `lichkham_ibfk_1` FOREIGN KEY (`MaCBYT`) REFERENCES `canboyte` (`MaCBYT`),
  CONSTRAINT `lichkham_ibfk_2` FOREIGN KEY (`MaHS`) REFERENCES `hocsinh` (`MaHS`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichkham`
--

LOCK TABLES `lichkham` WRITE;
/*!40000 ALTER TABLE `lichkham` DISABLE KEYS */;
INSERT INTO `lichkham` VALUES (1,'2025-11-05','Phòng Y tế',1,23),(2,'2025-11-06','Phòng Y tế',2,24);
/*!40000 ALTER TABLE `lichkham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sosuckhoe`
--

DROP TABLE IF EXISTS `sosuckhoe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sosuckhoe` (
  `MaSK` int NOT NULL AUTO_INCREMENT,
  `ChieuCao` float DEFAULT NULL,
  `CanNang` float DEFAULT NULL,
  `HuyetAp` varchar(10) DEFAULT NULL,
  `NhomMau` varchar(5) DEFAULT NULL,
  `TinhTrang` text,
  `NgayKham` date DEFAULT NULL,
  `MaHS` int DEFAULT NULL,
  PRIMARY KEY (`MaSK`),
  KEY `MaHS` (`MaHS`),
  CONSTRAINT `sosuckhoe_ibfk_1` FOREIGN KEY (`MaHS`) REFERENCES `hocsinh` (`MaHS`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sosuckhoe`
--

LOCK TABLES `sosuckhoe` WRITE;
/*!40000 ALTER TABLE `sosuckhoe` DISABLE KEYS */;
INSERT INTO `sosuckhoe` VALUES (1,140.5,35.2,'110/70','O','Bình thường','2025-10-01',23),(2,145.3,38.7,'115/75','A','Bình thường','2025-10-01',24),(3,140.5,35.2,'110/70','O','Bình thường','2025-10-01',23),(4,145.3,38.7,'115/75','A','Bình thường','2025-10-01',24),(5,145.2,38.5,'110/70','O','Sức khỏe tốt','2025-10-20',21),(6,142.8,36,'108/68','A','Thiếu cân nhẹ','2025-10-20',22),(7,150.5,42.3,'115/75','B','Bình thường','2025-10-20',23),(8,144,37.5,'112/70','AB','Bình thường','2025-10-20',24),(9,151.2,45,'118/76','O','Sức khỏe tốt','2025-10-20',25),(10,143.5,38.2,'109/69','A','Bình thường','2025-10-20',26),(11,152.1,46.8,'120/78','B','Thể lực tốt','2025-10-20',27),(12,141.9,35.9,'107/67','O','Thiếu cân nhẹ','2025-10-20',28),(13,149.4,43.5,'115/73','AB','Sức khỏe tốt','2025-10-20',29),(14,153,47.2,'119/75','O','Bình thường','2025-10-20',30),(15,145.8,39.1,'112/70','A','Bình thường','2025-10-20',31),(16,147,41,'114/72','B','Bình thường','2025-10-20',32),(17,152.5,45.7,'118/76','O','Sức khỏe tốt','2025-10-20',33),(18,143.2,38,'110/68','A','Bình thường','2025-10-20',34),(19,151.8,44.6,'116/74','B','Bình thường','2025-10-20',35),(20,140.5,36.9,'108/70','AB','Thiếu cân nhẹ','2025-10-20',36),(21,150,42.8,'115/75','O','Bình thường','2025-10-20',37),(22,153.5,48.2,'120/78','B','Sức khỏe tốt','2025-10-20',38),(23,145.1,37.9,'111/70','A','Bình thường','2025-10-20',39),(24,152.8,46.3,'118/76','O','Sức khỏe tốt','2025-10-20',40),(25,145.2,38.5,'110/70','O','Sức khỏe tốt','2025-10-20',21),(26,142.8,36,'108/68','A','Thiếu cân nhẹ','2025-10-20',22),(27,150.5,42.3,'115/75','B','Bình thường','2025-10-20',23),(28,144,37.5,'112/70','AB','Bình thường','2025-10-20',24),(29,151.2,45,'118/76','O','Sức khỏe tốt','2025-10-20',25),(30,143.5,38.2,'109/69','A','Bình thường','2025-10-20',26),(31,152.1,46.8,'120/78','B','Thể lực tốt','2025-10-20',27),(32,141.9,35.9,'107/67','O','Thiếu cân nhẹ','2025-10-20',28),(33,149.4,43.5,'115/73','AB','Sức khỏe tốt','2025-10-20',29),(34,153,47.2,'119/75','O','Bình thường','2025-10-20',30),(35,145.8,39.1,'112/70','A','Bình thường','2025-10-20',31),(36,147,41,'114/72','B','Bình thường','2025-10-20',32),(37,152.5,45.7,'118/76','O','Sức khỏe tốt','2025-10-20',33),(38,143.2,38,'110/68','A','Bình thường','2025-10-20',34),(39,151.8,44.6,'116/74','B','Bình thường','2025-10-20',35),(40,140.5,36.9,'108/70','AB','Thiếu cân nhẹ','2025-10-20',36),(41,150,42.8,'115/75','O','Bình thường','2025-10-20',37),(42,153.5,48.2,'120/78','B','Sức khỏe tốt','2025-10-20',38),(43,145.1,37.9,'111/70','A','Bình thường','2025-10-20',39),(44,152.8,46.3,'118/76','O','Sức khỏe tốt','2025-10-20',40);
/*!40000 ALTER TABLE `sosuckhoe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `MaTaiKhoan` int NOT NULL AUTO_INCREMENT,
  `TenDangNhap` varchar(50) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `VaiTro` enum('HocSinh','CanBoYTe','BanGiamHieu') NOT NULL,
  PRIMARY KEY (`MaTaiKhoan`),
  UNIQUE KEY `TenDangNhap` (`TenDangNhap`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'hs001','123456','HocSinh'),(2,'hs002','123456','HocSinh'),(3,'hs003','123456','HocSinh'),(4,'hs004','123456','HocSinh'),(5,'hs005','123456','HocSinh'),(6,'hs006','123456','HocSinh'),(7,'hs007','123456','HocSinh'),(8,'hs008','123456','HocSinh'),(9,'hs009','123456','HocSinh'),(10,'hs010','123456','HocSinh'),(11,'hs011','123456','HocSinh'),(12,'hs012','123456','HocSinh'),(13,'hs013','123456','HocSinh'),(14,'hs014','123456','HocSinh'),(15,'hs015','123456','HocSinh'),(16,'hs016','123456','HocSinh'),(17,'hs017','123456','HocSinh'),(18,'hs018','123456','HocSinh'),(19,'hs019','123456','HocSinh'),(20,'hs020','123456','HocSinh'),(21,'cb001','123456','CanBoYTe'),(22,'cb002','123456','CanBoYTe'),(23,'cb003','123456','CanBoYTe'),(24,'cb004','123456','CanBoYTe'),(25,'cb005','123456','CanBoYTe'),(26,'thanh.pham','matkhau123','BanGiamHieu'),(27,'hung.vo','matkhau123','BanGiamHieu');
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongbao`
--

DROP TABLE IF EXISTS `thongbao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao` (
  `MaTB` int NOT NULL AUTO_INCREMENT,
  `TieuDe` varchar(255) DEFAULT NULL,
  `NoiDung` text,
  `NgayDang` date DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaTB`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `thongbao_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao`
--

LOCK TABLES `thongbao` WRITE;
/*!40000 ALTER TABLE `thongbao` DISABLE KEYS */;
INSERT INTO `thongbao` VALUES (1,'Thông báo khám sức khỏe','Các lớp 6, 7 sẽ khám sức khỏe ngày 5/11.','2025-11-01',22);
/*!40000 ALTER TABLE `thongbao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thuvien`
--

DROP TABLE IF EXISTS `thuvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thuvien` (
  `MaTV` int NOT NULL AUTO_INCREMENT,
  `TenTaiLieu` varchar(255) DEFAULT NULL,
  `DuongDan` varchar(255) DEFAULT NULL,
  `LoaiTaiLieu` enum('Video','HinhAnh','TaiLieu') DEFAULT NULL,
  `NgayThem` date DEFAULT NULL,
  `MaTaiKhoan` int DEFAULT NULL,
  PRIMARY KEY (`MaTV`),
  KEY `MaTaiKhoan` (`MaTaiKhoan`),
  CONSTRAINT `thuvien_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thuvien`
--

LOCK TABLES `thuvien` WRITE;
/*!40000 ALTER TABLE `thuvien` DISABLE KEYS */;
INSERT INTO `thuvien` VALUES (1,'Hướng dẫn rửa tay đúng cách','https://truong.edu.vn/rua-tay.mp4','Video','2025-11-01',23),(2,'Hướng dẫn rửa tay đúng cách','https://truong.edu.vn/rua-tay.mp4','Video','2025-11-01',23),(13,'Hướng dẫn rửa tay đúng cách','https://truong.edu.vn/rua-tay.mp4','Video','2025-11-01',23),(14,'Kỹ thuật sơ cứu cơ bản','Video hướng dẫn xử lý các tình huống cấp cứu thường gặp.','Video','2025-10-15',21),(15,'Tài liệu về Bệnh học đường','Tài liệu chi tiết về cận thị, gù lưng, và cách phòng tránh.','TaiLieu','2025-10-28',22),(16,'Poster Dinh dưỡng','Infographic về tháp dinh dưỡng cân đối cho học sinh.','HinhAnh','2025-11-01',21),(17,'Phòng chống dịch sốt xuất huyết','Video tuyên truyền tại trường học.','Video','2025-11-05',23);
/*!40000 ALTER TABLE `thuvien` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-12 16:53:28
