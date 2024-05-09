-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2024 at 02:15 AM
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
-- Table structure for table `daily_total_avg_calculation`
--

CREATE TABLE `daily_total_avg_calculation` (
  `date` date NOT NULL,
  `daily_total_mile` int(11) NOT NULL,
  `daily_total_pay` decimal(10,0) NOT NULL,
  `daily_avg_per_hour` decimal(10,0) NOT NULL,
  `daily_avg_per_mile` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mileage_and_pay`
--

CREATE TABLE `mileage_and_pay` (
  `ID` int(11) NOT NULL,
  `date` date NOT NULL,
  `mileage_start` int(7) NOT NULL,
  `mileage_end` int(7) NOT NULL,
  `pay` decimal(10,0) NOT NULL,
  `company` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_total_avg_calculation`
--

CREATE TABLE `monthly_total_avg_calculation` (
  `month` varchar(20) NOT NULL,
  `monthly_total_mile` int(11) NOT NULL,
  `monthly_total_pay` decimal(10,0) NOT NULL,
  `monthly_avg_per_hour` decimal(10,0) NOT NULL,
  `monthly_avg_per_mile` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `per_company_monthly_total_avg_calculation`
--

CREATE TABLE `per_company_monthly_total_avg_calculation` (
  `month` varchar(25) NOT NULL,
  `company` varchar(25) NOT NULL,
  `monthly_total_pay` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `per_company_weekly_total_avg_calculation`
--

CREATE TABLE `per_company_weekly_total_avg_calculation` (
  `week_start_date` date NOT NULL,
  `company` varchar(25) NOT NULL,
  `weekly_total_pay` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `per_company_yearly_total_avg_calculation`
--

CREATE TABLE `per_company_yearly_total_avg_calculation` (
  `year` int(11) NOT NULL,
  `company` varchar(25) NOT NULL,
  `yearly_total_pay` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `weekly_total_avg_calculation`
--

CREATE TABLE `weekly_total_avg_calculation` (
  `week_start_date` date NOT NULL,
  `weekly_total_mile` int(11) NOT NULL,
  `weekly_total_pay` decimal(10,0) NOT NULL,
  `weekly_avg_per_hour` decimal(10,0) NOT NULL,
  `weekly_avg_per_mile` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `yearly_total_avg_calculation`
--

CREATE TABLE `yearly_total_avg_calculation` (
  `year` int(4) NOT NULL,
  `yearly_total_mile` int(11) NOT NULL,
  `yearly_total_pay` decimal(15,0) NOT NULL,
  `yearly_avg_per_hour` decimal(15,0) NOT NULL,
  `yearly_avg_per_mile` decimal(15,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_total_avg_calculation`
--
ALTER TABLE `daily_total_avg_calculation`
  ADD PRIMARY KEY (`date`);

--
-- Indexes for table `mileage_and_pay`
--
ALTER TABLE `mileage_and_pay`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `per_company_monthly_total_avg_calculation`
--
ALTER TABLE `per_company_monthly_total_avg_calculation`
  ADD PRIMARY KEY (`month`,`company`);

--
-- Indexes for table `per_company_weekly_total_avg_calculation`
--
ALTER TABLE `per_company_weekly_total_avg_calculation`
  ADD PRIMARY KEY (`week_start_date`,`company`);

--
-- Indexes for table `per_company_yearly_total_avg_calculation`
--
ALTER TABLE `per_company_yearly_total_avg_calculation`
  ADD PRIMARY KEY (`year`,`company`);

--
-- Indexes for table `weekly_total_avg_calculation`
--
ALTER TABLE `weekly_total_avg_calculation`
  ADD PRIMARY KEY (`week_start_date`);

--
-- Indexes for table `yearly_total_avg_calculation`
--
ALTER TABLE `yearly_total_avg_calculation`
  ADD PRIMARY KEY (`year`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mileage_and_pay`
--
ALTER TABLE `mileage_and_pay`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
