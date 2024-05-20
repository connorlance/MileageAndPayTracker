-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2024 at 10:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mileagepaycalculator`
--

-- --------------------------------------------------------

--
-- Table structure for table `mileage_and_pay`
--

CREATE TABLE `mileage_and_pay` (
  `ID` int(11) NOT NULL,
  `date` date NOT NULL,
  `mileage_start` int(11) NOT NULL,
  `mileage_end` int(11) NOT NULL,
  `total_miles` int(11) NOT NULL,
  `pay` decimal(10,2) NOT NULL,
  `company` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `per_company_total_avg_calculation`
--

CREATE TABLE `per_company_total_avg_calculation` (
  `ID` int(11) NOT NULL,
  `company` varchar(30) NOT NULL,
  `period` enum('daily','weekly','monthly','yearly') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_miles` int(11) NOT NULL,
  `total_pay` decimal(15,0) NOT NULL,
  `avg_per_mile` decimal(15,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `total_avg_calculation`
--

CREATE TABLE `total_avg_calculation` (
  `ID` int(11) NOT NULL,
  `period` enum('daily','weekly','monthly','yearly') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_miles` int(11) NOT NULL,
  `total_pay` decimal(10,2) NOT NULL,
  `avg_per_mile` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mileage_and_pay`
--
ALTER TABLE `mileage_and_pay`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `per_company_total_avg_calculation`
--
ALTER TABLE `per_company_total_avg_calculation`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `total_avg_calculation`
--
ALTER TABLE `total_avg_calculation`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mileage_and_pay`
--
ALTER TABLE `mileage_and_pay`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `per_company_total_avg_calculation`
--
ALTER TABLE `per_company_total_avg_calculation`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `total_avg_calculation`
--
ALTER TABLE `total_avg_calculation`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

