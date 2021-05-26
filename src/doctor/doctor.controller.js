"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.DoctorController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var DoctorController = /** @class */ (function () {
    function DoctorController(doctorService) {
        this.doctorService = doctorService;
    }
    DoctorController.prototype.findAll = function () {
        return this.doctorService.findAll();
    };
    DoctorController.prototype.findOne = function (id) {
        return this.doctorService.findOne(id);
    };
    DoctorController.prototype.create = function (createDoctorDto) {
        return this.doctorService.create(createDoctorDto);
    };
    DoctorController.prototype.update = function (id, updateDoctorDto) {
        return this.doctorService.update(id, updateDoctorDto);
    };
    DoctorController.prototype.remove = function (id) {
        return this.doctorService.remove(id);
    };
    __decorate([
        common_1.Get(),
        openapi.ApiResponse({ status: 200, type: [require("./entities/doctor.entity").Doctor] })
    ], DoctorController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/doctor.entity").Doctor }),
        __param(0, common_1.Param('id'))
    ], DoctorController.prototype, "findOne");
    __decorate([
        common_1.Post(),
        openapi.ApiResponse({ status: 201, type: require("./entities/doctor.entity").Doctor }),
        __param(0, common_1.Body())
    ], DoctorController.prototype, "create");
    __decorate([
        common_1.Patch(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/doctor.entity").Doctor }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], DoctorController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/doctor.entity").Doctor }),
        __param(0, common_1.Param('id'))
    ], DoctorController.prototype, "remove");
    DoctorController = __decorate([
        swagger_1.ApiTags('doctor'),
        common_1.Controller('doctor')
    ], DoctorController);
    return DoctorController;
}());
exports.DoctorController = DoctorController;
