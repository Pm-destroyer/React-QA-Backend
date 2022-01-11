/**
 * Master Model
 */

module.exports = {

  //Customer

  // verification of student via Student ID.

  get_student: function (connection, domainid, employeeid, controllerCallback) {
    var sql = " SELECT * from superadmindb.domain, adamasdb.employee_detail WHERE org_domain= ? AND adamasdb.employee_detail.email= ? UNION SELECT * from superadmindb.domain, mitdb.employe_detail WHERE org_domain= ? AND mitdb.employe_detail.email= ? ";

    connection.query(sql, [domainid, employeeid, domainid, employeeid], (err, result) => {
      controllerCallback(err, result);
    })
  },

  // Getting the "view details" data of "current due" module for display.
  get_current_details: function (connection,employeeid, domainid, controllerCallback) {
    

      var sql = "SELECT adamasdb.employee_detail.name, adamasdb.employee_detail.email, adamasdb.employee_detail.phone, superadmindb.organizaion.organization_name FROM adamasdb.employee_detail, superadmindb.organizaion WHERE adamasdb.employee_detail.email = ? AND superadmindb.organizaion.org_unique_id=(SELECT superadmindb.organizaion.org_unique_id  FROM superadmindb.organizaion INNER JOIN superadmindb.domain ON superadmindb.organizaion.org_unique_id=superadmindb.domain.org_unique_id WHERE superadmindb.domain.org_domain= ? ) UNION SELECT mitdb.employe_detail.name, mitdb.employe_detail.email, mitdb.employe_detail.phone, superadmindb.organizaion.organization_name FROM mitdb.employe_detail, superadmindb.organizaion WHERE mitdb.employe_detail.email = ? AND  superadmindb.organizaion.org_unique_id=(SELECT superadmindb.organizaion.org_unique_id  FROM superadmindb.organizaion INNER JOIN superadmindb.domain ON superadmindb.organizaion.org_unique_id=superadmindb.domain.org_unique_id WHERE superadmindb.domain.org_domain= ? );";
      connection.query(sql, [employeeid, domainid, employeeid, domainid], (err, result_session) => {

        controllerCallback(err, result_session);
      });
   
  },

}
