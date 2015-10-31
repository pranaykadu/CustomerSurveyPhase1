	// create the module and name it scotchApp
	var myApp = angular.module('myApp', ['ngRoute']);

	// configure our routes
	myApp.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'login.html',
				controller  : 'CustomerSurvey'
			})
			.when('/surveyForm', {
				templateUrl : 'surveyForm.html',
				controller  : 'SurveyForm'
			})
			.when('/AllFirmsByEvaluator', {
				templateUrl : 'AllFirmsByEvaluator.html',
				controller  : 'FirmDetails',
				resolve: {

			      /*"GetFirms": function( $q, $timeout,surveyService,FirmService ) {
			        //var getDetails = $q.defer();
			       return $timeout(function(){
			        	
			          return{
			            getAllfirms: function( surveyService,FirmService) {
			              return FirmService.events(surveyService.getUserID())
			            }
			            
			            
			          };
			        },5000);
			        
			      }}*/

	
				myVar: function ($q,surveyService,FirmService,$timeout,$http) {
					var defer = $q.defer();
					var url='http://localhost:8080/RESTfulProject/REST/WebService/GetFirmDetails/' + surveyService.getUserID() ;
					var req={
				 	method: 'GET',
				 	url: url,
				 	headers: {
				  		  'Content-Type': 'application/json'}
				   };
					var firmdata='';
					 $http(req).then(function successCallback(response) {
					 	//debugger;
		 			firmdata=response.data;
		 			surveyService.setFirmsData(response.data);
		 			 defer.resolve('done');
		 			})

					/*$timeout(function(){
					console.log("test>>>>>>>>>>>>>>>>>>> "+ firmdata);
                
                },3000);*/
	console.log("firmdata>>>>>>>>>>>" +firmdata);
					return defer.promise;
			  }}
			})

			.when('/customer_satisfaction', {
				templateUrl : 'customer_satisfaction.html',
				controller  : 'customer_satisfaction'
			})
			.when('/customer_support_follow_up', {
				templateUrl : 'customer_support_follow_up.html',
				controller  : 'customer_follow_up'
			})
			.when('/thankQ', {
				templateUrl : 'thankQ.html'
				
			})
	});

myApp.factory('FirmService', ['$http','$timeout', function($http,$timeout){

	var firmdata='';
	var loadFirmsData= function(userID){
              var url='http://localhost:8080/RESTfulProject/REST/WebService/GetFirmDetails/' + userID ;
			    //alert(url);
			    console.log(url);

				var req={
				 	method: 'GET',
				 	url: url,
				 	headers: {
				  		  'Content-Type': 'application/json'}
				   };
		 		
		 	 $timeout(function(){	
		 	return	$http(req).then(function successCallback(response) {
		 			firmdata=response.data;
		 			console.log("returned data is >>>>>>>>>>>>>>>>" + angular.toJson(response.data));
		 			return response.data;
		 			
		  }, function errorCallback(response) {
		    
		  });
console.log("FirmService return :>>>>>>>>>>>" + firmdata );

			          
			        },500);
		 			
 		};
 		return {
      events: loadFirmsData}
    

}]);
	
myApp.factory('surveyService', function() {
  		var surveyData = [];
  		var userid='';
  		var FirmsData='';
  		var FirmID='';

  		var addSurvey = function(newObj) {
     		surveyData.push(newObj);
  		};

  		var getSurvey = function(){
     		return surveyData;
  		};
  		var setUserID=function(uid){
  				userid=uid;
  				console.log("Set User ID :>>>>>>>>>>>"+userid);
  		}
  		var getUserID=function(){
  			console.log("Get User ID :>>>>>>>>>>>"+userid);
  			return userid;
  		}

  		var setFirmsData=function(fdata){
  				FirmsData=fdata;
  				console.log("Set firmdata :>>>>>>>>>>>"+FirmsData);
  		}
  		var getFirmsData=function(){
  			console.log("Get FirmsData :>>>>>>>>>>>"+FirmsData);
  			return FirmsData;
  		}
  		var saveFirmID =function(firmid,uid){
  			FirmID=firmid
  		}
  		var getFirmID =function(){
  			return FirmID;
  		}
  		return {
    		addSurvey: addSurvey,
    		getSurvey: getSurvey,
    		getUserID:getUserID,
    		setUserID:setUserID,
    		getFirmsData:getFirmsData,
    		setFirmsData:setFirmsData,
    		saveFirmID:saveFirmID,
    		getFirmID:getFirmID

  		};
	});


myApp.controller('SurveyForm',['$http','$scope','$location','surveyService','FirmService', function($http,$scope,$location,surveyService,FirmService,myVar) {
		
	/*	$scope.SurveyForm.firmID= surveyService.getFirmID();
		$scope.SurveyForm.userID= surveyService.getUserID();
		alert("test>>>>>>>>user>>>>>firm>>>>"+ $scope.firmID + $scope.userID);*/
		
    	$scope.surveyFormData=function(alldata){
        $scope.SurveyForm.firmID= surveyService.getFirmID();
		$scope.SurveyForm.userID= surveyService.getUserID();
    		
    		//alert($scope.SurveyForm.Objectives);
    		//alldata.add('FirmID :' + $scope.firmID);
    		//alert(angular.toJson(alldata) );
    		var req={
 	method: 'POST',
 	url: 'http://localhost:8080/RESTfulProject/REST/WebService/WriteSurveyData',
 	headers: {
  		  'Content-Type': 'application/json'}, data:angular.toJson(alldata)
   };
 		
 		
 		$http(req);
    		$location.path('/thankQ');
    	}
	}]);
myApp.controller('FirmDetails',['$http','$scope','$location','surveyService','FirmService', function($http,$scope,$location,surveyService,FirmService,myVar) {
		$scope.form1_data={};
		$scope.userdata={};
		$scope.firms= surveyService.getFirmsData();
		//alert(angular.toJson($scope.firms));
		console.log($scope.firms.data);
    	$scope.getSurveyDone=function(firmid,uid){

    		surveyService.saveFirmID(firmid);
    		//alert(firmid + " dsfdfd   >>>>>" + uid );
    		$location.path('/surveyForm');
    	}
	}]);


myApp.controller('CustomerSurvey',['$http','$timeout','$scope','$location','surveyService','FirmService', function($http,$timeout,$scope,$location,surveyService,FirmService) {
		$scope.form1_data={};
		$scope.userdata={};
		$scope.SubmitLoginDetails = function(user)
		{  
			//alert(angular.toJson(user));
			
			var url='http://localhost:8080/RESTfulProject/REST/WebService/GetLoginDetails/' + user.email +'/'+ user.password
			
						$scope.form1_data=angular.copy(user);
						//surveyService.addSurvey($scope.form1_data);
						$scope.test1= angular.toJson(user);
				 var req={
				 	method: 'GET',
				 	url: url,
				 	headers: {
				  		  'Content-Type': 'application/json'}
				   };
				 		
				 	 $timeout(function(){
			       	
				 		$http(req).then(function successCallback(response) {

				 			
				 			if(response.data.userID){
				 				
								    $scope.userdata=response.data;
								    surveyService.setUserID(response.data.userID);
								    $location.path('/AllFirmsByEvaluator');

		    					}
						  
				    else{
				    	alert("Invalid User ID or Password");
				    }
				  }, function errorCallback(response) {
				    
				  });

			          
			        },1000);


		//console.log($scope.form1_data);
		// user_account_creation(); 
		 //alert();
        
    	}

$scope.showData=function(){
$scope.firms=surveyService.getFirmData();
 	}
    	
	}]);

	myApp.controller('user_account',['$http','$scope','$location','surveyService', function($http,$scope,$location,surveyService) {
		$scope.form1_data={};
		$scope.user_account_data = function(user){  
		$scope.form1_data=angular.copy(user);
		//surveyService.addSurvey($scope.form1_data);
		$scope.test1= angular.toJson(user);
 var req={
 	method: 'POST',
 	url: 'http://localhost:8080/RESTfulProject/REST/WebService/WriteFeeds',
 	headers: {
  		  'Content-Type': 'application/json'}, data:$scope.test1
   };
 		
 		
 		$http(req);

		//console.log($scope.form1_data);
		// user_account_creation(); 
		 //alert();

        $location.path('/customer_satisfaction');
    	}
    	
	}]);

/*	myApp.controller('user_account',function($scope,$http){
		$http.get('js/state.json').success(function(response){
			$scope.myData = response;
		});
	});*/

	
	myApp.controller('customer_satisfaction',['$scope', '$location','surveyService', function($scope,$location,surveyService) {
		$scope.form2_data={};
		$scope.customer_satisfaction_data = function(customer_satisfaction){  
		$scope.form2_data=angular.copy(customer_satisfaction);
		surveyService.addSurvey($scope.form2_data);
		//console.log($scope.form2_data);
		//cust_satisfaction();
		$scope.test1= angular.toJson($scope.form2_data);
		alert($scope.test1);
		
        $location.path('/customer_support_follow_up');
    	}
    	
	}]);

	myApp.controller('customer_follow_up',['$scope', '$location','surveyService', function($scope,$location,surveyService) {
		$scope.form3_data={};
		$scope.customer_follow_up_data = function(followupData){  
			$scope.form3_data=angular.copy(followupData);
			surveyService.addSurvey($scope.form3_data);
			console.log(surveyService.getSurvey());
			//alert(angular.toJson(surveyService.getSurvey()));
			//customer_support_follow_up();
			
			$scope.test1= angular.toJson(surveyService.getSurvey());
			alert($scope.test1);var req={
 	method: 'POST',
 	url: 'http://localhost:8080/RESTfulProject/REST/WebService/WriteSurveyFeeds',
 	headers: {
  		  'Content-Type': 'application/json'}, data:$scope.test1
   };
 		
 
 		
 	//$location.path('/thankQ');
    	}
    	
	}]);
	
