// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(bodyParser.json());

// 连接到 MongoDB 数据库（请替换为你自己的 MongoDB 连接字符串）
mongoose.connect('mongodb://localhost/calculator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 创建数据库模型
const Calculation = mongoose.model('Calculation', {
  formula: String,
  result: Number,
  timestamp: { type: Date, default: Date.now }
});

// 处理计算请求
app.post('/calculate', async (req, res) => {
  const { formula, result } = req.body;
  const calculation = new Calculation({ formula, result });

  try {
    await calculation.save();
    res.status(200).json({ message: 'Calculation result saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving calculation result' });
  }
});

// 获取历史记录
app.get('/history', async (req, res) => {
  try {
    const history = await Calculation.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving calculation history' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
