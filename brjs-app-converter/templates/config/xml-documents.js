import {registerToXMLResourceServiceConstructed} from 'ct-services/xml/ConfigurableXMLResourceService';

registerToXMLResourceServiceConstructed((configurableXMLResourceService) => {
	configurableXMLResourceService.mergeInXMLDocuments(
		require('mobile-blotter/_resources/xml/OrderCancel.xml'),
		require('mobile-blotter/_resources/xml/OrderChangeState.xml')
	);
});
