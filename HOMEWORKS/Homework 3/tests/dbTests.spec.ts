import {test, expect} from "@playwright/test";
import { connectToOracleDB } from "../connectionToDb";  
import OracleDB from "oracledb";

// Изпълнете npm install oracledb и npm install --save-dev @types/oracledb в терминала, 
// за да не подчертава горния ред.
// След като го изпълните, ще трябва да рестартирате VS Code.


// TEST 1
test('Test joining drivers and their countries', async ({}) => {
    const query = `select d.FIRST_NAME, d.LAST_NAME, d.PHONE, c.COUNTRY_NAME
        from APP_DRIVER d JOIN APP_COUNTRY c ON d.country_id = c.country_id`; 
   
    console.log('Query Results:');
    const rows = await connectToOracleDB(query) as any[];;
    
    expect(rows.length).toBeGreaterThanOrEqual(0);
});

// TEST 2
test('Test if each driver has a mentioned country', async({}) => {
    const query = `SELECT * FROM APP_DRIVER WHERE COUNTRY_ID IS NULL`;

    const rows = await connectToOracleDB(query) as any[];

    expect(rows.length).toBe(0);
});

// TEST 3
test('Test if each order has a status', async({}) => {
    const query = `SELECT * FROM APP_ORDER WHERE ORDER_STATUS_ID IS NULL`;

    const rows = await connectToOracleDB(query) as any[];

    expect(rows.length).toBe(0);
});

// TEST 4
test('Test if user\'s country is different from their orders countries', async ({}) => {
    const query = `SELECT u.USER_ID, u.COUNTRY_ID, 
        o.ORDER_ID, o.COUNTRY_ID
        FROM APP_USER u JOIN APP_ORDER o 
        ON u.USER_ID = o.USER_ID
        WHERE u.COUNTRY_ID <> o.COUNTRY_ID`;

    const rows = await connectToOracleDB(query) as any[];

    expect(rows.length).toBe(0);
});

// TEST 5 (бонус тест, защото го измислих, а не знам кой от предните да изтрия)
test('Test if each country has at least one city', async ({}) => {
    const query = `SELECT c.COUNTRY_NAME, ci.CITY_NAME 
            FROM APP_COUNTRY c
            LEFT JOIN APP_CITY ci ON c.COUNTRY_ID = ci.COUNTRY_ID
            WHERE CITY_NAME IS NULL`;
    
    const rows = await connectToOracleDB(query) as any[];

    expect(rows.length).toBe(0);
});