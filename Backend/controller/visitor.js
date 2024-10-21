const Visitors = require("../models/visitor");

exports.getVisitors = async (req, res) => {
  try {
    const visitor = await Visitors.find();
    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//check multiply entry

exports.checkVisitors = async (req, res) => {
  try {
    const { mobileNo, dateOfVisit } = re.query;
    const visitor = await Visitors.find()
      .where("mobileNo")
      .equals(mobileNo)
      .where("dateOfVisit")
      .equals(dateOfVisit);
    if (visitor.length === 0) {
      return res.status(400).json({
        success: false,
        data: `Visitor is not found for the above date ${dateOfVisit} and mobileNo  ${mobileNo}`,
      });
    }
    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//query search for visitors

exports.getVisitorsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = re.query;
    const visitor = await Visitors.find()
      .where("dateOfVisit")
      .gte(startDate)

      .lte(endDate);
    if (visitor.length === 0) {
      return res.status(400).json({
        success: false,
        data: `Visitor not found for date range between  ${startDate} and ${endDate}`,
      });
    }
    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const visitor = await Visitors.create(req.body);
    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
