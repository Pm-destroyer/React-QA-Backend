/**
 * Master Model
 */

module.exports = {

  //Customer

  // verification of student via Student ID.

  get_student: function (connection, domainid, employeeid, controllerCallback) {
    var sql = " SELECT * from superadmindb.domain, adamasdb.employee_detail WHERE aes_decrypt(superadmindb.domain.org_domain,'domain')= ? AND aes_decrypt(adamasdb.employee_detail.email, 'adamasdb')= ? UNION SELECT * from superadmindb.domain, mitdb.employe_detail WHERE aes_decrypt(superadmindb.domain.org_domain, 'domain')= ? AND aes_decrypt(mitdb.employe_detail.email,'mitdb')= ? ";

    connection.query(sql, [domainid, employeeid, domainid, employeeid], (err, result) => {
      controllerCallback(err, result);
    })
  },

  // Getting the "view details" data of "current due" module for display.
  get_current_details: function (connection, employeeid, domainid, controllerCallback) {


    var sql = "SELECT cast(aes_decrypt(adamasdb.employee_detail.name, superadmindb.organizaion.organization_key) as char(50)) AS name, cast(aes_decrypt(adamasdb.employee_detail.email,superadmindb.organizaion.organization_key) as char(50)) AS email, cast(aes_decrypt(adamasdb.employee_detail.phone,superadmindb.organizaion.organization_key) as char(10)) AS phone, superadmindb.organizaion.organization_name FROM adamasdb.employee_detail, superadmindb.organizaion WHERE aes_decrypt(adamasdb.employee_detail.email,superadmindb.organizaion.organization_key) = ? AND superadmindb.organizaion.org_unique_id=(SELECT superadmindb.organizaion.org_unique_id  FROM superadmindb.organizaion INNER JOIN superadmindb.domain ON superadmindb.organizaion.org_unique_id=aes_decrypt(superadmindb.domain.org_unique_id, 'domain') WHERE aes_decrypt(superadmindb.domain.org_domain,'domain')= ? ) UNION SELECT cast(aes_decrypt(mitdb.employe_detail.name,superadmindb.organizaion.organization_key) as char(50)), cast(aes_decrypt(mitdb.employe_detail.email,superadmindb.organizaion.organization_key) as char(50)), cast(aes_decrypt(mitdb.employe_detail.phone,superadmindb.organizaion.organization_key) as char(50)), superadmindb.organizaion.organization_name FROM mitdb.employe_detail, superadmindb.organizaion WHERE aes_decrypt(mitdb.employe_detail.email, superadmindb.organizaion.organization_key) = ? AND  superadmindb.organizaion.org_unique_id=(SELECT superadmindb.organizaion.org_unique_id  FROM superadmindb.organizaion INNER JOIN superadmindb.domain ON superadmindb.organizaion.org_unique_id=aes_decrypt(superadmindb.domain.org_unique_id, 'domain') WHERE aes_decrypt(superadmindb.domain.org_domain,'domain')= ? );";
    connection.query(sql, [employeeid, domainid, employeeid, domainid], (err, result_session) => {

      controllerCallback(err, result_session);
    });

  },

}
