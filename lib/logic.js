/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Write your transction processor functions here
 */

/**
 * add a Port Entry
 * @param {org.inet.SetupDemo} setupDemo
 * @transaction
 */

async function setupDemo(addPortEntry) {
    const factory = getFactory();
    const NS = 'org.inet';

    //create 2 ports
    const port1 = factory.newResource(NS, 'Port', 'P001')
    const port2 = factory.newResource(NS, 'Port', 'P002')
    const portRegistry = await getParticipantRegistry(NS + '.Port')
    await portRegistry.addAll([port1, port2])
   

    //create 2 containers
    const container1 = factory.newResource(NS, 'Container', 'C001')
    const container2 = factory.newResource(NS, 'Container', 'C002')
    container1.containerStatus='Ready for Pickup'
    container2.containerStatus='Ready for Pickup'
    const containerRegistry = await getAssetRegistry(NS + '.Container')
    await containerRegistry.addAll([container1, container2])

     //create 2 Drivers
    const driver1 = factory.newResource(NS, 'Driver', 'D001')
    const driver2 = factory.newResource(NS, 'Driver', 'D002')
    driver1.driverStatus='Available'
    driver2.driverStatus='Available'
    const driverRegistry = await getParticipantRegistry(NS + '.Driver')
    await driverRegistry.addAll([driver1, driver2])

    //create a Port Entry Certificate
    const pec1 = factory.newResource(NS, 'PortEntryCertificate', 'PEC-001')
    pec1.driver = factory.newRelationship(NS, 'Driver', 'D001')
    pec1.container = factory.newRelationship(NS, 'Container', 'C001')
    pec1.port = factory.newRelationship(NS, 'Port', 'P001')
    const pecRegistry = await getAssetRegistry(NS + '.PortEntryCertificate')
    await pecRegistry.addAll([pec1])
}

/**
 * add a Container Pickup Transaction
 * @param {org.inet.pickupContainer} pickupContainer
 * @transaction
 */

async function pickupContainer(pickupContainer) {
    const factory = getFactory();
    const NS = 'org.inet';

    const transfer = factory.newResource(NS, 'Transfer', pickupContainer.transferId)
    transfer.transferType = 'Pickup'
    const transferReg = await getAssetRegistry(NS + '.Transfer');
    await transferReg.addAll([transfer]);

//    pickupContainer.portEntryCertificate.container.Transfer.push(pickupContainer.transfer)
    pickupContainer.portEntryCertificate.PortEntryCertificate.push(pickupContainer.portEntryCertificate)

    const container = await getAssetRegistry(NS + '.Container');
    await container.addAll([pickupContainer]);
}