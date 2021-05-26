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
exports.UpdatePatientDto = exports.CreatePatientDto = void 0;
var openapi = require("@nestjs/swagger");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreatePatientDto = /** @class */ (function () {
    function CreatePatientDto() {
    }
    CreatePatientDto._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, first_name: { required: true, type: function () { return String; } }, last_name: { required: true, type: function () { return String; } }, diseases: { required: false, type: function () { return [String]; } } };
    };
    __decorate([
        swagger_1.ApiProperty({
            description: 'The Patients unique id as a string',
            example: '5'
        }),
        class_validator_1.IsString()
    ], CreatePatientDto.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Patients first name as a string',
            example: 'Miha'
        }),
        class_validator_1.IsString()
    ], CreatePatientDto.prototype, "first_name");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Patients last name as a string',
            example: 'Mulec'
        }),
        class_validator_1.IsString()
    ], CreatePatientDto.prototype, "last_name");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Array of the patients, optionally with diseases in an array of strings',
            example: [
                {
                    first_name: 'Miha',
                    last_name: 'Mulec',
                    diseases: ['knows_javascript', 'learning_sql']
                },
            ]
        }),
        class_validator_1.IsString({ each: true })
    ], CreatePatientDto.prototype, "diseases");
    return CreatePatientDto;
}());
exports.CreatePatientDto = CreatePatientDto;
var UpdatePatientDto = /** @class */ (function (_super) {
    __extends(UpdatePatientDto, _super);
    function UpdatePatientDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdatePatientDto._OPENAPI_METADATA_FACTORY = function () {
        return {};
    };
    return UpdatePatientDto;
}(swagger_1.PartialType(CreatePatientDto)));
exports.UpdatePatientDto = UpdatePatientDto;
