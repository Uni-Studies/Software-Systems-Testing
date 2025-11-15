import {test, expect} from "@playwright/test";

// TEST 1
test('POST To All Products List', async ({request}) => {
    const response = await request.post('https://automationexercise.com/api/productsList',
        {
            form: {
                name: 'Test Product',
                price: '19.99',
                category: 'Women > Tops',
                brand: 'TestBrand',
                description: 'Sample Product'
            }
        }
    );

    const responseText = await response.text();
    console.log(responseText);
    
    const json = JSON.parse(responseText);

    expect(json.responseCode).toBe(405);
    expect(json.message).toContain("This request method is not supported");
});

// TEST 2
test('POST To Verify Login with invalid details', async ({request}) => {
    const response = await request.post('https://automationexercise.com/api/verifyLogin', {
        form: {
            email: "test@gmail.com",
            password: "123456" 
        }
    });

    const responseText = await response.text();
    const json = JSON.parse(responseText);

    console.log(responseText);
    expect(json.responseCode).toBe(404);
    expect(json.message).toContain("User not found!");
});

// TEST 3
test('GET user account detail by email', async ({request}) => {
    const email = 'test@gmail.com'; 
    const response = await request.get(
        'https://automationexercise.com/api/getUserDetailByEmail',
        {
            params: { email }
        }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(data);

    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(email);
}); 

// TEST 4
test('POST To Search Product without search_product parameter', async({request}) => {
    const response = await request.post('https://automationexercise.com/api/searchProduct');

    const responseText = await response.text();
    const json = JSON.parse(responseText);

    console.log(responseText);
    expect(json.responseCode).toBe(400);
    expect(json.message).toContain("Bad request");
});

// TEST 5 (бонус тест, защото го написах, преди да видя, че в условието на домашната се изискват само GET и POST заявки, а този е с PUT)

test('PUT To All Brands List', async ({request}) => {
    const response = await request.put('https://automationexercise.com/api/brandsList',
        {
            form: {
                id: 1,
                brand: "Oracle"
            }
        }
    );

    const responseText = await response.text();
    const json = JSON.parse(responseText);

    console.log(responseText);
    expect(json.responseCode).toBe(405);
    expect(json.message).toContain("This request method is not supported");

});
