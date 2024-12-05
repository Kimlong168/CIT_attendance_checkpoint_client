export const telegramMessageTemplate = [
  {
    type: "Employee Work Assignment Confirmation",
    subject: "Confirmation of New Work Assignment",
    body: `Dear [Employee's Name],

I hope this message finds you well.

This is to confirm that you have been assigned the responsibility of [Project/Task Name], effective from [Start Date]. Please ensure all deliverables are completed by [End Date]. You will be working closely with [Team Members/Supervisor's Name] on this task.

If you have any questions or need support, feel free to reach out.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Attendance Reminder",
    subject: "Reminder: Attendance for [Date]",
    body: `Dear [Employee's Name],

I hope you're doing well.

This is a reminder that your attendance for today ([Date]) is being tracked. Please ensure that you mark your attendance on time. If you are unable to attend today, kindly inform us in advance.

Thank you for your cooperation.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Leave Request Confirmation",
    subject: "Leave Request Confirmation",
    body: `Dear [Employee's Name],

I hope this message finds you well.

Your leave request for [Leave Type] from [Start Date] to [End Date] has been received and is currently under review. We will notify you of the approval status shortly.

If you have any questions or need further assistance, feel free to contact us.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Leave Request Approval",
    subject: "Leave Request Approved",
    body: `Dear [Employee's Name],

We are pleased to inform you that your leave request for [Leave Type] from [Start Date] to [End Date] has been approved.

Please make the necessary arrangements and let us know if you need any assistance in preparing for your leave.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Leave Request Denial",
    subject: "Leave Request Denied",
    body: `Dear [Employee's Name],

Thank you for your leave request for [Leave Type] from [Start Date] to [End Date]. Unfortunately, we are unable to approve your request at this time due to [Reason].

Please feel free to discuss alternative dates or any concerns with us.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Tardiness Notification",
    subject: "Tardiness Alert: [Date]",
    body: `Dear [Employee's Name],

We noticed that you were late to work today ([Date]). Please make sure to report on time moving forward. Repeated tardiness may lead to further actions.

If you have any issues or need support, let us know.

Best regards,
[Manager's Name], CIT`,
  },
  {
    type: "Employee Overtime Notification",
    subject: "Overtime Notification",
    body: `Dear [Employee's Name],

This is to notify you that you are requested to work overtime today ([Date]) from [Start Time] to [End Time]. Please confirm if you are available to accommodate this.

Thank you for your dedication.

Best regards,
[Manager's Name], CIT`,
  },
];
