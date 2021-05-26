"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateDoctorDto = exports.CreateDoctorDto = void 0;
var openapi = require("@nestjs/swagger");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var patient_dto_1 = require("../../../../../../../../../src/patient/dto/patient.dto");
var CreateDoctorDto = /** @class */ (function () {
    function CreateDoctorDto() {
    }
    CreateDoctorDto._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, department: { required: true, type: function () { return String; } }, patients: { required: false, type: function () { return [Object]; } } };
    };
    __decorate([
        swagger_1.ApiProperty({
            description: 'The Doctors unique id as a string',
            example: '100'
        }),
        class_validator_1.IsString()
    ], CreateDoctorDto.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({
            description: 'The department the doctor works in as a string',
            example: 'marand'
        }),
        class_validator_1.IsString()
    ], CreateDoctorDto.prototype, "department");
    __decorate([
        swagger_1.ApiProperty({
            description: 'An array of the doctors patients as json objects',
            example: ['extremely_happy', 'understands_REST']
        }),
        class_validator_1.IsArray()
    ], CreateDoctorDto.prototype, "patients");
    return CreateDoctorDto;
}());
exports.CreateDoctorDto = CreateDoctorDto;
var UpdateDoctorDto = /** @class */ (function (_super) {
    __extends(UpdateDoctorDto, _super);
    function UpdateDoctorDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateDoctorDto._OPENAPI_METADATA_FACTORY = function () {
        return {};
    };
    return UpdateDoctorDto;
}(swagger_1.PartialType(CreateDoctorDto)));
exports.UpdateDoctorDto = UpdateDoctorDto;
