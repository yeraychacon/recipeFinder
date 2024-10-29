const express = require('express');
const app = express();
const fs = require('fs');
const { connect } = require('http2');
const mongoose = require('mongoose');
const port = 3000;

//Connect to MongoDB
connectDB();
