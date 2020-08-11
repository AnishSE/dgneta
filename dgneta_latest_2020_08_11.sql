-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2020 at 06:54 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dgneta`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `first_name`, `last_name`, `password`, `profile_image`, `email`, `status`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '', 'admin@gmail.com', 1, '2020-07-25 16:43:02', '2020-07-25 16:43:02', '2020-07-25 16:43:02');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `is_rescheduled` tinyint(2) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '0->rejected 1->pending 2->approved ',
  `read_status` int(11) NOT NULL DEFAULT 1,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `date`, `time`, `subject`, `description`, `user_id`, `sub_admin_id`, `is_rescheduled`, `status`, `read_status`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, '2020-11-07', '12:00:00', 'Test', 'Rejected Appointment', 1, 1, 0, 0, 1, '2020-08-02 17:02:00', '2020-07-21 22:59:41', '2020-08-02 17:02:00'),
(2, '2020-11-07', '12:00:00', 'Test', 'Test Description1', 1, 1, 0, 1, 1, '2020-08-02 17:01:08', '2020-07-21 23:04:25', '2020-08-02 17:01:08'),
(3, '2020-11-07', '12:00:00', 'Test', 'Approved Appointment', 1, 1, 0, 2, 1, '2020-08-02 17:01:48', '2020-07-21 23:10:09', '2020-08-02 17:01:48'),
(4, '2020-11-07', '12:00:00', 'Test', 'Pending Appointment 4', 1, 1, 0, 1, 1, '2020-08-02 17:44:34', '2020-07-21 23:23:11', '2020-08-02 17:44:34'),
(5, '2020-08-13', '06:00:00', 'Test', 'Pending Appointment', 1, 1, 0, 1, 1, '2020-08-02 21:25:12', '2020-07-21 23:29:43', '2020-08-02 21:25:12');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '''1'' - Gallery, ''2''- Work ',
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `message`, `user_id`, `status`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Test Message', 2, 1, '2020-08-03 18:36:56', '2020-07-21 21:36:45', '2020-08-03 18:36:56'),
(2, 1, 'Test Message', 2, 1, '2020-08-03 18:36:51', '2020-07-21 21:37:01', '2020-08-03 18:36:51'),
(3, 3, 'Test Message', 2, 1, '2020-08-03 18:38:15', '2020-07-21 21:37:24', '2020-08-03 18:38:15'),
(4, 3, 'cvxvxxvxjhhjbdsadmnsMN', 2, 2, '2020-08-03 18:26:14', '2020-08-03 18:26:14', '2020-08-03 18:26:14'),
(5, 4, 'Work Comment', 2, 2, '2020-08-03 18:32:52', '2020-08-03 18:32:52', '2020-08-03 18:32:52');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` varchar(255) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '0->rejected 1->inprogress 2->resolved',
  `read_status` int(11) NOT NULL DEFAULT 1,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `user_id`, `sub_admin_id`, `media_url`, `media_type`, `message`, `title`, `status`, `read_status`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, NULL, NULL, '12345', 'test', 1, 1, '2020-08-03 20:32:00', '2020-07-21 22:27:03', '2020-08-03 20:32:00'),
(2, 1, 2, NULL, NULL, '12345', 'test', 1, 1, '2020-08-03 20:32:06', '2020-07-21 22:27:06', '2020-08-03 20:32:06'),
(3, 1, 2, 'https://test-rum.s3.amazonaws.com/1595445657723.jpg', NULL, 'test', 'test', 1, 1, '2020-08-03 20:31:36', '2020-07-23 00:51:06', '2020-08-03 20:31:36'),
(4, 1, 2, 'https://test-rum.s3.amazonaws.com/1595445876342.jpg', NULL, 'test', 'test', 1, 1, '2020-08-03 20:31:43', '2020-07-23 00:54:45', '2020-08-03 20:31:43'),
(5, 1, 0, 'https://test-rum.s3.amazonaws.com/1595446016183.jpg', NULL, 'test', 'test', 1, 1, '2020-07-23 00:57:04', '2020-07-23 00:57:04', '2020-07-23 00:57:04'),
(6, 1, 2, 'https://test-rum.s3.amazonaws.com/1595446265222.jpg', NULL, 'test', 'test', 1, 1, '2020-08-03 20:31:33', '2020-07-23 01:01:14', '2020-08-03 20:31:33'),
(7, 1, 0, 'https://test-rum.s3.amazonaws.com/1595448052915.jpg', NULL, 'test', 'test', 1, 1, '2020-07-23 01:31:01', '2020-07-23 01:31:01', '2020-07-23 01:31:01'),
(8, 1, 2, 'https://test-rum.s3.amazonaws.com/1595448225786.jpg', NULL, 'test', 'test', 1, 1, '2020-08-03 20:31:47', '2020-07-23 01:33:54', '2020-08-03 20:31:47'),
(9, 1, 0, 'https://test-rum.s3.amazonaws.com/1595448458670.jpg', NULL, 'test', 'test', 1, 1, '2020-07-23 01:37:39', '2020-07-23 01:37:39', '2020-07-23 01:37:39'),
(10, 1, 2, 'https://test-rum.s3.amazonaws.com/1595448565779.jpg', NULL, 'test', 'test', 1, 1, '2020-08-03 20:31:50', '2020-07-23 01:39:26', '2020-08-03 20:31:50'),
(11, 1, 0, 'https://test-rum.s3.amazonaws.com/1595530893704.jpg', NULL, 'test', 'test', 1, 1, '2020-07-24 00:31:34', '2020-07-24 00:31:34', '2020-07-24 00:31:34');

-- --------------------------------------------------------

--
-- Table structure for table `complaints_reply`
--

CREATE TABLE `complaints_reply` (
  `id` int(11) NOT NULL,
  `complaint_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `complaints_reply`
--

INSERT INTO `complaints_reply` (`id`, `complaint_id`, `message`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Go to Hell.', '2020-08-02 16:48:39', '2020-08-02 16:48:39', '2020-08-02 16:48:39'),
(2, 5, 'test reply', '2020-08-03 21:32:43', '2020-08-03 21:09:34', '2020-08-03 21:32:43'),
(3, 2, 'test reply', '2020-08-03 21:12:03', '2020-08-03 21:12:03', '2020-08-03 21:12:03'),
(4, 3, 'test reply', '2020-08-03 21:32:35', '2020-08-03 21:13:27', '2020-08-03 21:32:35');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `sub_admin_id`, `media_url`, `description`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'abc@abc.com', 'test', '2020-07-23 02:36:32', '2020-07-22 00:00:59', '2020-07-23 02:36:32'),
(2, 1, 'abc@abc.com', 'test', '2020-07-22 00:01:01', '2020-07-22 00:01:01', '2020-07-22 00:01:01');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deletedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `sub_admin_id`, `description`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'test', 1, 'test', '2020-07-23 20:44:07', '2020-07-24 02:14:07', '2020-07-24 02:14:07'),
(2, 'test', 1, 'test', '2020-07-23 20:44:14', '2020-07-24 02:14:14', '2020-07-24 02:14:14'),
(3, 'test1', 2, 'tst1', '2020-08-02 12:30:06', '2020-08-02 18:00:06', '2020-08-02 18:00:06'),
(4, 'test1', 2, 'tst1', '2020-08-02 12:30:40', '2020-08-02 18:00:40', '2020-08-02 18:00:40'),
(5, 'test1', 2, 'tst1', '2020-08-02 12:31:19', '2020-08-02 18:01:19', '2020-08-02 18:01:19'),
(6, 'test1', 2, 'tst1', '2020-08-02 12:31:56', '2020-08-02 18:01:56', '2020-08-02 18:01:56'),
(7, 'test1', 2, 'tst1', '2020-08-02 12:32:28', '2020-08-02 18:02:28', '2020-08-02 18:02:28'),
(8, 'Test Title', 2, 'Test Media Description', '2020-08-03 09:24:26', '2020-08-03 14:54:26', '2020-08-03 14:54:26'),
(9, 'Test Tt', 2, 'Test Desc', '2020-08-09 13:55:01', '2020-08-09 19:25:01', '2020-08-09 19:25:01'),
(10, 'test title', 2, 'test desc', '2020-08-09 14:33:49', '2020-08-09 20:03:49', '2020-08-09 20:03:49'),
(11, 'test tt', 2, 'test desc', '2020-08-09 14:35:54', '2020-08-09 20:05:54', '2020-08-09 20:05:54'),
(12, 'Test tt', 2, 'Test Desc', '2020-08-09 14:55:45', '2020-08-09 20:25:45', '2020-08-09 20:25:45');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_media`
--

CREATE TABLE `gallery_media` (
  `id` int(11) NOT NULL,
  `gallery_id` int(11) NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `deletedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gallery_media`
--

INSERT INTO `gallery_media` (`id`, `gallery_id`, `media_url`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'https://test-rum.s3.amazonaws.com/1595530893704.jpg', '2020-08-02 16:24:27', '2020-07-24 02:14:53', '2020-08-02 21:54:27'),
(3, 1, 'https://test-rum.s3.amazonaws.com/1595530893704.jpg', '2020-07-23 20:44:53', '2020-07-24 02:14:53', '2020-07-24 02:14:53'),
(4, 8, 'https://intromu-media.s3.amazonaws.com/1596446660420.jpg', '2020-08-03 09:24:26', '2020-08-03 14:54:26', '2020-08-03 14:54:26'),
(5, 3, 'https://intromu-media.s3.amazonaws.com/1596447595351.jpg', '2020-08-03 09:40:00', '2020-08-03 15:10:00', '2020-08-03 15:10:00'),
(6, 9, 'https://intromu-media.s3.amazonaws.com/1596981298643.png', '2020-08-09 13:55:02', '2020-08-09 19:25:02', '2020-08-09 19:25:02'),
(7, 10, 'https://intromu-media.s3.amazonaws.com/1596983625517.png', '2020-08-09 14:33:49', '2020-08-09 20:03:49', '2020-08-09 20:03:49'),
(8, 11, 'https://intromu-media.s3.amazonaws.com/1596983749564.png', '2020-08-09 14:35:54', '2020-08-09 20:05:54', '2020-08-09 20:05:54'),
(9, 12, 'https://intromu-media.s3.amazonaws.com/1596984943569.png', '2020-08-09 14:55:45', '2020-08-09 20:25:45', '2020-08-09 20:25:45'),
(10, 3, 'https://intromu-media.s3.amazonaws.com/1596985161610.png', '2020-08-09 14:59:27', '2020-08-09 20:29:27', '2020-08-09 20:29:27');

-- --------------------------------------------------------

--
-- Table structure for table `join_event`
--

CREATE TABLE `join_event` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `deletedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `join_event`
--

INSERT INTO `join_event` (`id`, `user_id`, `event_id`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2020-07-22 21:13:38', '2020-07-23 02:43:38', '2020-07-23 02:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `sub_admin`
--

CREATE TABLE `sub_admin` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cover_photo_url` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `present_position` varchar(255) DEFAULT NULL,
  `past_position` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `roles` int(11) NOT NULL DEFAULT 2,
  `deletedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_admin`
--

INSERT INTO `sub_admin` (`id`, `first_name`, `last_name`, `facebook_url`, `phone`, `email`, `password`, `cover_photo_url`, `dob`, `education`, `blood_group`, `profile_image`, `present_position`, `past_position`, `email_id`, `status`, `roles`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'User', '', '9696969696', 'admin@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'https://intromu-media.s3.amazonaws.com/1596452645790.jpg', '1991-07-28', '', '', NULL, 'Clerk', '', NULL, 0, 0, '2020-08-09 13:22:12', '2020-07-26 19:07:58', '2020-08-09 18:52:12'),
(2, 'SubAdmin', 'User', '', '', 'subadmin@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'https://intromu-media.s3.amazonaws.com/1596295868999.jpg', '2020-07-02', '', 'A+', 'https://intromu-media.s3.amazonaws.com/1596294391167.jpg', '', '', NULL, 1, 2, '2020-08-03 16:21:05', '2020-07-25 19:06:38', '2020-08-03 21:51:05'),
(3, 'Narender', 'Modi', 'abc@fb.com', '9988998899', 'nmodi@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'https://test-rum.s3.amazonaws.com/1595530893704.jpg', '2020-07-01', 'B.TECH', 'O-', 'https://test-rum.s3.amazonaws.com/1595530893704.jpg', 'PM', 'CM', 'modi@gmail.com', 0, 2, '2020-08-03 16:18:16', '2020-07-21 19:52:27', '2020-08-03 21:48:16'),
(5, 'User', 'One', NULL, NULL, 'user1@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL, NULL, 'Engineer', NULL, NULL, 1, 2, '2020-08-02 12:00:28', '2020-07-26 19:12:56', '2020-08-02 17:30:28'),
(6, 'User', 'Two', NULL, NULL, 'user2@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL, NULL, 'MP', NULL, NULL, 1, 2, '2020-07-26 13:44:33', '2020-07-26 19:14:33', '2020-07-26 19:14:33'),
(7, 'User', 'Three', NULL, NULL, 'user3@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL, NULL, 'CM', NULL, NULL, 1, 2, '2020-07-26 13:50:36', '2020-07-26 19:20:36', '2020-07-26 19:20:36'),
(8, 'User', 'Four', NULL, NULL, 'user4@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL, NULL, 'MLA', NULL, NULL, 1, 2, '2020-07-26 14:00:16', '2020-07-26 19:30:16', '2020-07-26 19:30:16'),
(11, 'Test', 'SubAdmin', NULL, NULL, 'testsubadmin@gmail.com', '25d55ad283aa400af464c76d713c07ad', NULL, NULL, NULL, NULL, NULL, 'MLA', NULL, NULL, 1, 2, '2020-08-09 13:20:47', '2020-08-09 18:50:47', '2020-08-09 18:50:47');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `sub_admin_id`, `title`, `description`, `type`, `category`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(4, 2, 'Test Social Title 2', 'Test Social Description 2', 'Social', '', '2020-08-03 20:17:35', '2020-08-03 16:28:41', '2020-08-03 20:17:35'),
(6, 2, 'Test Pending Title 1', 'Test Pending Description 1', 'Pending', 'Welfare', '2020-08-03 20:17:10', '2020-08-03 16:36:29', '2020-08-03 20:17:10'),
(7, 2, 'Test Development Title 1', 'Test Development Description 1', 'Development', 'Public Affair', '2020-08-03 20:16:48', '2020-08-03 16:40:02', '2020-08-03 20:16:48'),
(8, 2, 'Test Title', 'Test Des', 'Development', 'Education', '2020-08-09 20:51:32', '2020-08-09 20:51:32', '2020-08-09 20:51:32'),
(9, 2, 'Test Social Title', 'Test Social Description 4', 'Social', '', '2020-08-09 20:52:42', '2020-08-09 20:52:42', '2020-08-09 20:52:42');

-- --------------------------------------------------------

--
-- Table structure for table `tasks_media`
--

CREATE TABLE `tasks_media` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `deletedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tasks_media`
--

INSERT INTO `tasks_media` (`id`, `task_id`, `media_url`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(3, 4, 'https://intromu-media.s3.amazonaws.com/1596452316506.jpg', '2020-08-03 16:28:41', '2020-08-03 16:28:41', '2020-08-03 16:28:41'),
(6, 6, 'https://intromu-media.s3.amazonaws.com/1596452787033.jpg', '2020-08-03 16:36:29', '2020-08-03 16:36:29', '2020-08-03 16:36:29'),
(8, 7, 'https://intromu-media.s3.amazonaws.com/1596453000498.png', '2020-08-03 16:40:02', '2020-08-03 16:40:02', '2020-08-03 16:40:02'),
(9, 8, 'https://intromu-media.s3.amazonaws.com/1596986488997.png', '2020-08-09 20:51:32', '2020-08-09 20:51:32', '2020-08-09 20:51:32'),
(10, 9, 'https://intromu-media.s3.amazonaws.com/1596986560710.png', '2020-08-09 20:52:42', '2020-08-09 20:52:42', '2020-08-09 20:52:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `taluka` varchar(255) NOT NULL,
  `village` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `add_mobile_no` varchar(20) DEFAULT NULL,
  `sub_admin_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `deletedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `birth_date`, `taluka`, `village`, `mobile_number`, `add_mobile_no`, `sub_admin_id`, `status`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 0, '2020-07-26 13:54:38', '2020-07-24 00:21:37', '2020-07-26 19:24:38'),
(2, 'Anish', 'Thakur', '1994-08-01', 'chd', 'chd', '9988998899', '', 1, 1, '2020-08-01 13:44:45', '2020-07-24 00:25:22', '2020-08-01 19:14:45'),
(3, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:02:56', '2020-07-24 00:32:56', '2020-07-24 00:32:56'),
(4, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:04:24', '2020-07-24 00:34:24', '2020-07-24 00:34:24'),
(5, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:07:40', '2020-07-24 00:37:40', '2020-07-24 00:37:40'),
(6, 'Abhishek', 'Sharma', '0000-00-00', 'pathankot', 'pathankot', '9988282727', '', 1, 1, '2020-07-23 19:09:57', '2020-07-24 00:39:57', '2020-07-24 00:39:57'),
(7, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:11:35', '2020-07-24 00:41:35', '2020-07-24 00:41:35'),
(8, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:11:41', '2020-07-24 00:41:41', '2020-07-24 00:41:41'),
(9, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:11:47', '2020-07-24 00:41:47', '2020-07-24 00:41:47'),
(10, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:14:51', '2020-07-24 00:44:51', '2020-07-24 00:44:51'),
(11, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:15:05', '2020-07-24 00:45:05', '2020-07-24 00:45:05'),
(12, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:15:20', '2020-07-24 00:45:20', '2020-07-24 00:45:20'),
(13, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:18:16', '2020-07-24 00:48:16', '2020-07-24 00:48:16'),
(14, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:18:32', '2020-07-24 00:48:32', '2020-07-24 00:48:32'),
(15, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:20:00', '2020-07-24 00:50:00', '2020-07-24 00:50:00'),
(16, 'Abhishek', 'sharma', '0000-00-00', 'Pathabkot', 'Pathankot', '9988282727', '', 1, 1, '2020-07-23 19:44:04', '2020-07-24 01:14:04', '2020-07-24 01:14:04'),
(17, 'Abhishek', 'sharma', '0000-00-00', 'Pathankot', 'Pathankot', '9988282727', '', 1, 1, '2020-07-23 19:44:11', '2020-07-24 01:14:11', '2020-07-24 01:14:11'),
(18, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:45:13', '2020-07-24 01:15:13', '2020-07-24 01:15:13'),
(19, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:45:16', '2020-07-24 01:15:16', '2020-07-24 01:15:16'),
(20, 'Anish', 'Thakur', '0000-00-00', 'chd', 'chd', '9988998899', '', 1, 1, '2020-07-23 19:47:08', '2020-07-24 01:17:08', '2020-07-24 01:17:08'),
(21, 'Abhishek', 'sharma', '0000-00-00', 'Pathankot', 'Pathankot', '9988282727', '', 1, 1, '2020-07-23 19:47:18', '2020-07-24 01:17:18', '2020-07-24 01:17:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `complaints_reply`
--
ALTER TABLE `complaints_reply`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_media`
--
ALTER TABLE `gallery_media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `join_event`
--
ALTER TABLE `join_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_admin`
--
ALTER TABLE `sub_admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks_media`
--
ALTER TABLE `tasks_media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `complaints_reply`
--
ALTER TABLE `complaints_reply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `gallery_media`
--
ALTER TABLE `gallery_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `join_event`
--
ALTER TABLE `join_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sub_admin`
--
ALTER TABLE `sub_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tasks_media`
--
ALTER TABLE `tasks_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
