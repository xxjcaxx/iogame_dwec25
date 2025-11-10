

import { beforeEach, describe, expect, test, vi } from "vitest";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/env";

import * as Supaservice from "../src/services/supaservice"

describe("Supaservice tests unitaris",()=>{
    describe("getBearer",()=>{
        test("getBearer ha de retornar un bearer ben montat",()=>{
            expect(Supaservice.getBearer()).toBe("bearer 1234")
        });
    });
});
/*
describe("Supaservice tests integracio",()=>{

});*/