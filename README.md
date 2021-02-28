# Jmeter Maven Automation Testing

Jmeter Maven Automation Testing is to develop the tests using Jmeter GUI and execute and generate the reports using maven tool.

#### Required Tools

```
Maven
Java

```

#### Usage

To run all the tests
```mvn commands
mvn test

```
To invoke the JMeter GUI using the following command
```
mvn jmeter:configure jmeter:gui

```

To preload a test in JMeter GUI
```
mvn jmeter:configure jmeter:gui -DguiTestFile=src/test/jmeter/test.jmx

```

#### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

#### License
[MIT](https://choosealicense.com/licenses/mit/)