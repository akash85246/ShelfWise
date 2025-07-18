const {   createReport, deleteReport } = require("../db/queries");

async function postCreateReport(req, res) {
  try {
    const { reviewId, reason } = req.body;
    const user = req.user || {};

    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user.id;    
    if (!reviewId || !reason || !userId) {
        return res.status(400).json({ error: "Missing required fields" });  
    }


    const report = await createReport({ userId, reviewId, reason  });
    if (!report) {
      return res.status(404).json({ error: "User not found or report not created" });
    }
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteReportById(req, res) {
    try {
        const { reviewId } = req.params;
        const user = req.user || {};
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userId = user.id;

       
        if (!reviewId || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

      
        
        const deletedReport = await deleteReport({reviewId, userId});
        if (!deletedReport) {
            return res.status(404).json({ error: "Report not found or not deleted" });
        }
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



module.exports = {
    postCreateReport,
    deleteReportById
};
