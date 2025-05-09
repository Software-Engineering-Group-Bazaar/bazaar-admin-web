/*
 * Bazaar API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.68
 *
 * Do not edit the class manually.
 *
 */
import ApiClient from '../ApiClient';

/**
 * The ApproveUserDto model module.
 * @module model/ApproveUserDto
 * @version v1
 */
export default class ApproveUserDto {
  /**
   * Constructs a new <code>ApproveUserDto</code>.
   * @alias module:model/ApproveUserDto
   * @class
   * @param userId {String} 
   */
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Constructs a <code>ApproveUserDto</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApproveUserDto} obj Optional instance to populate.
   * @return {module:model/ApproveUserDto} The populated <code>ApproveUserDto</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ApproveUserDto();
      if (data.hasOwnProperty('userId'))
        obj.userId = ApiClient.convertToType(data['userId'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} userId
 */
ApproveUserDto.prototype.userId = undefined;

