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
exports.DiseaseController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var DiseaseController = /** @class */ (function () {
    function DiseaseController(diseaseService) {
        this.diseaseService = diseaseService;
    }
    DiseaseController.prototype.findAll = function () {
        return this.diseaseService.findAll();
    };
    DiseaseController.prototype.findOne = function (id) {
        return this.diseaseService.findOne(id);
    };
    DiseaseController.prototype.create = function (createDiseaseDto) {
        return this.diseaseService.create(createDiseaseDto);
    };
    DiseaseController.prototype.update = function (id, updateDiseaseDto) {
        return this.diseaseService.update(id, updateDiseaseDto);
    };
    DiseaseController.prototype.remove = function (id) {
        return this.diseaseService.remove(id);
    };
    __decorate([
        common_1.Get(),
        openapi.ApiResponse({ status: 200, type: [require("./entities/disease.entity").Disease] })
    ], DiseaseController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/disease.entity").Disease }),
        __param(0, common_1.Param('id'))
    ], DiseaseController.prototype, "findOne");
    __decorate([
        common_1.Post(),
        openapi.ApiResponse({ status: 201, type: require("./entities/disease.entity").Disease }),
        __param(0, common_1.Body())
    ], DiseaseController.prototype, "create");
    __decorate([
        common_1.Patch(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/disease.entity").Disease }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], DiseaseController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entities/disease.entity").Disease }),
        __param(0, common_1.Param('id'))
    ], DiseaseController.prototype, "remove");
    DiseaseController = __decorate([
        swagger_1.ApiTags('disease'),
        common_1.Controller('disease')
    ], DiseaseController);
    return DiseaseController;
}());
exports.DiseaseController = DiseaseController;
