import ExcelJS from 'exceljs'

export const generateExcelFile = async (phrasesData, feedbackData, includeSubjectMatterCol) => {
  const workbook = new ExcelJS.Workbook()

  workbook.creator = 'Cambria'
  workbook.lastModifiedBy = 'Cambria'
  workbook.created = new Date()
  workbook.modified = new Date()

  // Create worksheets with headers and footers
  const sheet1 = workbook.addWorksheet('UnhandledPhrases');

  sheet1.columns = [
    { width: 100 },
    { width: 20 }
  ];

  let sheet1Columns = [
    {
      name: 'Phrase',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    },
    {
      name: 'Date',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    },
  ]

  if (includeSubjectMatterCol) {
    sheet1Columns = [...sheet1Columns, {
      name: 'SubjectMatter',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    }]

    sheet1.columns = [...sheet1.columns, { width: 20 }]
  }

  sheet1.addTable({
    name: 'PhrasesTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: {
      showRowStripes: true
    },
    columns: sheet1Columns,
    rows: phrasesData.length > 0 ? phrasesData : [['N/A', 'N/A', 'N/A']]
  })

  const sheet2 = workbook.addWorksheet('UserFeedback');

  sheet2.columns = [
    { width: 50 },
    { width: 20 },
    { width: 20 }
  ];

  let sheet2Columns = [
    {
      name: 'Comment',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    },
    {
      name: 'Date',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    },
    {
      name: 'Helpful',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    }
  ]

  if (includeSubjectMatterCol) {
    sheet2Columns = [...sheet2Columns, {
      name: 'SubjectMatter',
      filterButton: true,
      style: {
        font: {
          size: 16
        }
      }
    }]

    sheet2.columns = [...sheet2.columns, { width: 20 }]
  }

  sheet2.addTable({
    name: 'UserFeedback',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: {
      showRowStripes: true
    },
    columns: sheet2Columns,
    rows: feedbackData.length > 0 ? feedbackData : [['N/A', 'N/A', 'N/A']]
  })

  // write to a new buffer
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = "analytics.xlsx";
  link.click();
}