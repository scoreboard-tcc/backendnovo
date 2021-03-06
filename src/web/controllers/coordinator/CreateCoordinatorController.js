const CreateCoordinatorUseCase = require('../../../useCases/coordinator/CreateCoordinator/CreateCoordinatorUseCase');

class CreateCoordinatorController {
  /**
   * CreateCoordinatorController
   *
   * @class
   * @param {object} container - Container
   * @param {CreateCoordinatorUseCase} container.createCoordinatorUseCase - CreateCoordinatorUseCase
   */
  constructor({ createCoordinatorUseCase }) {
    this.createCoordinatorUseCase = createCoordinatorUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const coordinator = await this.createCoordinatorUseCase.execute(academyId, request.body);

    return response.status(201).json(coordinator);
  }
}

module.exports = CreateCoordinatorController;
